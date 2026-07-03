import { runQuery, runDmlAndVerify, compareResults } from './sqlEngine'
import {
  stripCommentsAndStrings,
  classifyError,
  missingConceptMessage,
  validateSemicolon,
  isEngineError,
  ENGINE_ERROR_MESSAGE,
} from './errorClassifier'
import type { Exercise, ValidationResult } from '../types'

/** Returns true if the query contains the keyword (outside comments/strings) */
function hasKeyword(cleanQuery: string, keyword: string): boolean {
  const pattern = new RegExp(`\\b${keyword.replace(' ', '\\s+')}\\b`, 'i')
  return pattern.test(cleanQuery)
}

export async function validateAnswer(
  exercise: Exercise,
  userQuery: string
): Promise<ValidationResult> {
  // --- Semicolon check (before everything else) ---
  const semiError = validateSemicolon(userQuery)
  if (semiError) {
    return {
      passed: false,
      conceptPassed: false,
      resultMatch: false,
      errorType: 'missing_semicolon',
      errorMessage: semiError,
    }
  }

  // --- DML safety: block UPDATE/DELETE without WHERE (applies in every mode) ---
  if (/^\s*(UPDATE|DELETE)/i.test(userQuery) && !/WHERE/i.test(userQuery)) {
    return {
      passed: false,
      conceptPassed: false,
      resultMatch: false,
      errorType: 'missing_where_dml',
      errorMessage:
        '⚠️ שים לב! פקודה זו ללא WHERE תפעל על כל השורות בטבלה. זה עלול למחוק או לשנות נתונים רבים בטעות.',
    }
  }

  const clean = stripCommentsAndStrings(userQuery)

  // --- Layer 1: Concept validation ---
  for (const check of exercise.requiredConcepts) {
    if (check.type === 'requiresKeyword' && check.keyword) {
      if (!hasKeyword(clean, check.keyword)) {
        // Try running the query anyway to check if result matches
        try {
          const isDml = /^\s*(INSERT|UPDATE|DELETE)/i.test(userQuery)
          let userResult: { columns: string[]; rows: import('../types').Row[] }

          if (isDml && exercise.verifyQuery) {
            userResult = await runDmlAndVerify(exercise.schema, userQuery, exercise.verifyQuery)
          } else {
            userResult = await runQuery(exercise.schema, userQuery)
          }

          const expectedResult = await runQuery(exercise.schema, exercise.expectedQuery)
          const isOrderSensitive = hasKeyword(clean, 'ORDER BY') || hasKeyword(exercise.expectedQuery, 'ORDER BY')
          const resultMatch = compareResults(expectedResult.rows, userResult.rows, isOrderSensitive)

          if (resultMatch) {
            // Result correct but concept missing — accept with educational note
            return {
              passed: true,
              conceptPassed: false,
              resultMatch: true,
              alternativeAccepted: true,
              alternativeMessage: `כל הכבוד — התוצאה נכונה! המשימה הזו מתרגלת את ${check.keyword}. נסה לכתוב אותה מחדש עם ${check.keyword} כדי לתרגל את הכלי.`,
              userRows: userResult.rows,
              userColumns: userResult.columns,
              expectedRows: expectedResult.rows,
              expectedColumns: expectedResult.columns,
            }
          }
        } catch (err) {
          // An engine/infrastructure failure here isn't a "missing concept" —
          // surface it distinctly instead of falling through to that message.
          const msg = err instanceof Error ? err.message : String(err)
          if (isEngineError(msg)) {
            return {
              passed: false,
              conceptPassed: false,
              resultMatch: false,
              errorType: 'engine_error',
              errorMessage: ENGINE_ERROR_MESSAGE,
              isEngineError: true,
            }
          }
          // Fall through to error message
        }

        return {
          passed: false,
          conceptPassed: false,
          resultMatch: false,
          errorType: 'missing_concept',
          errorMessage: missingConceptMessage(check.keyword),
        }
      }
    }

    if (check.type === 'forbidsPattern' && check.pattern) {
      if (new RegExp(check.pattern, 'i').test(clean)) {
        return {
          passed: false,
          conceptPassed: false,
          resultMatch: false,
          errorType: 'forbidden_pattern',
          errorMessage: check.message,
        }
      }
    }
  }

  // --- Layer 2: Result set validation ---
  try {
    const isDml = /^\s*(INSERT|UPDATE|DELETE)/i.test(userQuery)
    let userResult: { columns: string[]; rows: import('../types').Row[] }
    let expectedResult: { columns: string[]; rows: import('../types').Row[] }

    if (isDml && exercise.verifyQuery) {
      userResult = await runDmlAndVerify(exercise.schema, userQuery, exercise.verifyQuery)
      expectedResult = await runDmlAndVerify(exercise.schema, exercise.expectedQuery, exercise.verifyQuery)
    } else {
      const [u, e] = await Promise.all([
        runQuery(exercise.schema, userQuery),
        runQuery(exercise.schema, exercise.expectedQuery),
      ])
      userResult = u
      expectedResult = e
    }

    const isOrderSensitive =
      hasKeyword(stripCommentsAndStrings(exercise.expectedQuery), 'ORDER BY')
    const resultMatch = compareResults(expectedResult.rows, userResult.rows, isOrderSensitive)

    if (resultMatch) {
      return {
        passed: true,
        conceptPassed: true,
        resultMatch: true,
        userRows: userResult.rows,
        userColumns: userResult.columns,
        expectedRows: expectedResult.rows,
        expectedColumns: expectedResult.columns,
      }
    }

    const error = classifyError(
      userQuery,
      userResult.rows,
      expectedResult.rows,
      userResult.columns,
      expectedResult.columns
    )

    return {
      passed: false,
      conceptPassed: true,
      resultMatch: false,
      errorType: error.type,
      errorMessage: error.message,
      userRows: userResult.rows,
      userColumns: userResult.columns,
      expectedRows: expectedResult.rows,
      expectedColumns: expectedResult.columns,
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (isEngineError(msg)) {
      return {
        passed: false,
        conceptPassed: true,
        resultMatch: false,
        errorType: 'engine_error',
        errorMessage: ENGINE_ERROR_MESSAGE,
        isEngineError: true,
      }
    }
    // Translate common SQLite errors to Hebrew
    const hebrewMsg = translateSqlError(msg)
    return {
      passed: false,
      conceptPassed: true,
      resultMatch: false,
      errorType: 'sql_error',
      errorMessage: hebrewMsg,
    }
  }
}

function translateSqlError(msg: string): string {
  if (/no such table/i.test(msg)) {
    const table = msg.match(/no such table: (\w+)/i)?.[1] ?? ''
    return (
      `שגיאת תחביר: הטבלה "${table}" לא קיימת\n` +
      `איפה הבעיה: שם הטבלה כתוב שגוי או שהטבלה לא קיימת בבסיס הנתונים\n` +
      `איך לתקן: בדוק את שמות הטבלאות בסעיף "נתוני הטבלה" מצד שמאל`
    )
  }

  if (/no such column/i.test(msg)) {
    const col = msg.match(/no such column: (\S+)/i)?.[1] ?? ''
    return (
      `שגיאת תחביר: העמודה "${col}" לא קיימת\n` +
      `איפה הבעיה: שם העמודה כתוב שגוי או שהיא לא קיימת בטבלה זו\n` +
      `איך לתקן: בדוק את שמות העמודות בכותרת הטבלה`
    )
  }

  if (/ambiguous column name/i.test(msg)) {
    const col = msg.match(/ambiguous column name: (\S+)/i)?.[1] ?? ''
    return (
      `שגיאת תחביר: שם העמודה "${col}" מופיע ביותר מטבלה אחת\n` +
      `איפה הבעיה: בשאילתות JOIN, עמודות עם שמות זהים בשתי טבלאות דורשות ציון שם הטבלה\n` +
      `איך לתקן: כתוב שם_טבלה.שם_עמודה, למשל: employees.dept_id`
    )
  }

  if (/misuse of aggregate/i.test(msg)) {
    return (
      `שגיאת תחביר: שימוש לא תקין בפונקציית אגרגציה\n` +
      `איפה הבעיה: פונקציות כמו COUNT, SUM, AVG לא יכולות להופיע ב-WHERE\n` +
      `איך לתקן: השתמש ב-HAVING לסינון תוצאות קיבוץ (אחרי GROUP BY)`
    )
  }

  if (/syntax error/i.test(msg)) {
    const near = msg.match(/near "([^"]+)":\s*syntax error/i)?.[1]
    if (near) return buildSyntaxMessage(near)
    return (
      `שגיאת תחביר בשאילתה\n` +
      `איך לתקן: בדוק את מבנה הפקודה, שמות מילות המפתח, ופסיקים בין עמודות`
    )
  }

  if (/incomplete input/i.test(msg)) {
    return (
      `שגיאת תחביר: השאילתה לא שלמה\n` +
      `איפה הבעיה: ייתכן שחסרה מילת מפתח, שם טבלה, או חלק אחר מהשאילתה\n` +
      `איך לתקן: ודא שהשאילתה מכילה SELECT ... FROM ... ושאר החלקים הנדרשים`
    )
  }

  return (
    `אירעה שגיאה בלתי צפויה בהרצת השאילתה\n` +
    `פרטי השגיאה: ${msg}\n` +
    `איך לתקן: בדוק את תחביר השאילתה, או נסה לנסח אותה מחדש`
  )
}

function buildSyntaxMessage(near: string): string {
  const token = near.toUpperCase()

  if (token === 'FROM') {
    return (
      `שגיאת תחביר ליד FROM\n` +
      `איפה הבעיה: חסר שם עמודה לפני FROM, או שנשכחה מילת מפתח\n` +
      `איך לתקן: בדוק שכתבת: SELECT עמודה FROM טבלה\n` +
      `דוגמה: SELECT first_name FROM employees;`
    )
  }

  if (['WHERE', 'HAVING', 'GROUP', 'ORDER'].includes(token)) {
    return (
      `שגיאת תחביר ליד ${near}\n` +
      `איפה הבעיה: ייתכן שסדר המשפטים שגוי, או שחסר חלק לפני ${near}\n` +
      `איך לתקן: הסדר הנכון הוא: SELECT → FROM → WHERE → GROUP BY → HAVING → ORDER BY`
    )
  }

  if (token === 'BY') {
    return (
      `שגיאת תחביר: המילה BY הופיעה ללא GROUP או ORDER לפניה\n` +
      `איך לתקן: כתוב GROUP BY עמודה או ORDER BY עמודה`
    )
  }

  if (token === 'ON') {
    return (
      `שגיאת תחביר ב-JOIN: חסר תנאי ON\n` +
      `איפה הבעיה: אחרי שם הטבלה ב-JOIN חייב לבוא ON עם תנאי חיבור\n` +
      `דוגמה: INNER JOIN departments ON employees.dept_id = departments.dept_id;`
    )
  }

  if (token === 'JOIN') {
    return (
      `שגיאת תחביר ב-JOIN\n` +
      `איך לתקן: בדוק שכתבת את שם הטבלה אחרי JOIN ואת תנאי ON\n` +
      `דוגמה: INNER JOIN departments ON employees.dept_id = departments.dept_id;`
    )
  }

  if (token === ',') {
    return (
      `שגיאת תחביר: פסיק במקום שגוי\n` +
      `איפה הבעיה: ייתכן שיש פסיק מיותר בסוף רשימת העמודות, או שחסרה עמודה אחרי הפסיק\n` +
      `דוגמה נכונה: SELECT first_name, last_name, salary FROM employees;`
    )
  }

  if (token === '=') {
    return (
      `שגיאת תחביר ליד =\n` +
      `איפה הבעיה: אם ניסית להשוות ל-NULL, אי אפשר להשתמש ב-=\n` +
      `איך לתקן: השתמש ב-IS NULL או IS NOT NULL\n` +
      `דוגמה: WHERE email IS NULL;`
    )
  }

  return (
    `שגיאת תחביר ליד "${near}"\n` +
    `איך לתקן: בדוק את כתיב מילות המפתח ואת מבנה הפקודה`
  )
}
