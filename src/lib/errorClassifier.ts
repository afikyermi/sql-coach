import type { Row } from '../types'

export interface ErrorClassification {
  type: string
  message: string
}

/**
 * True when a caught error is an infrastructure/engine failure (the SQL engine's
 * WASM failed to load or fetch) rather than a mistake in the student's query.
 * These must never be shown or scored as a wrong SQL answer.
 */
export function isEngineError(msg: string): boolean {
  return /wasm|fetching of the|failed to fetch|networkerror|webassembly/i.test(msg)
}

export const ENGINE_ERROR_MESSAGE =
  'תקלה טכנית: מנוע ה-SQL לא נטען כרגע.\n' +
  'זו לא שגיאה בשאילתה שלך.\n' +
  'נסה שוב בעוד רגע.'

/** Strip comments and string literals from SQL for analysis */
export function stripCommentsAndStrings(sql: string): string {
  // Remove single-line comments
  let s = sql.replace(/--[^\n]*/g, ' ')
  // Remove multi-line comments
  s = s.replace(/\/\*[\s\S]*?\*\//g, ' ')
  // Remove string literals
  s = s.replace(/'[^']*'/g, "''")
  s = s.replace(/"[^"]*"/g, '""')
  return s
}

/** Identify the type of mistake from user query + result vs expected */
export function classifyError(
  userQuery: string,
  userRows: Row[],
  expectedRows: Row[],
  userColumns: string[],
  expectedColumns: string[]
): ErrorClassification {
  const clean = stripCommentsAndStrings(userQuery).toUpperCase()

  // Null comparison mistake
  if (/=\s*NULL\b/i.test(userQuery) || /!=\s*NULL\b/i.test(userQuery) || /<>\s*NULL\b/i.test(userQuery)) {
    return {
      type: 'null_comparison',
      message: 'לא ניתן להשוות ל-NULL עם = או !=. יש להשתמש ב-IS NULL או IS NOT NULL',
    }
  }

  // WHERE after GROUP BY (WHERE instead of HAVING)
  if (/GROUP\s+BY/.test(clean) && /HAVING/.test(clean) === false && userRows.length !== expectedRows.length) {
    return {
      type: 'where_instead_of_having',
      message: 'נראה שאתה מנסה לסנן לאחר קיבוץ. לאחר GROUP BY יש להשתמש ב-HAVING ולא ב-WHERE',
    }
  }

  // Missing WHERE (all rows returned instead of filtered)
  if (!/WHERE/.test(clean) && userRows.length > expectedRows.length && expectedRows.length > 0) {
    return {
      type: 'missing_where',
      message: 'קיבלת יותר שורות מהצפוי — שכחת לסנן עם WHERE?',
    }
  }

  // Missing FROM
  if (!clean.includes('FROM') && clean.includes('SELECT')) {
    return {
      type: 'missing_from',
      message: 'חסר FROM — חייב לציין מאיזו טבלה אתה שולף את הנתונים',
    }
  }

  // Missing GROUP BY with aggregate
  if (
    /\b(COUNT|SUM|AVG|MIN|MAX)\s*\(/.test(clean) &&
    !clean.includes('GROUP BY') &&
    userRows.length === 1 &&
    expectedRows.length > 1
  ) {
    return {
      type: 'missing_group_by',
      message: 'אתה משתמש בפונקציית אגרגציה אבל קיבלת שורה אחת בלבד — אולי שכחת GROUP BY?',
    }
  }

  // Wrong columns selected
  if (
    userRows.length === expectedRows.length &&
    userColumns.length !== expectedColumns.length
  ) {
    return {
      type: 'wrong_columns',
      message: `בחרת ${userColumns.length} עמודות אבל הצפוי הוא ${expectedColumns.length}. בדוק אילו עמודות ביקשו`,
    }
  }

  // Too many rows
  if (userRows.length > expectedRows.length) {
    return {
      type: 'too_many_rows',
      message: `קיבלת ${userRows.length} שורות, הצפוי הוא ${expectedRows.length}. בדוק את תנאי הסינון`,
    }
  }

  // Too few rows
  if (userRows.length < expectedRows.length) {
    return {
      type: 'too_few_rows',
      message: `קיבלת ${userRows.length} שורות, הצפוי הוא ${expectedRows.length}. אולי הסינון שלך מחמיר מדי?`,
    }
  }

  // Wrong sort order
  if (
    userRows.length === expectedRows.length &&
    userRows.length > 0 &&
    JSON.stringify(userRows) !== JSON.stringify(expectedRows)
  ) {
    const sameContent =
      JSON.stringify([...userRows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))) ===
      JSON.stringify([...expectedRows].sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b))))
    if (sameContent) {
      return {
        type: 'wrong_order',
        message: 'השורות נכונות אבל הסדר שגוי — בדוק את ORDER BY (ASC/DESC)',
      }
    }
  }

  // Generic wrong answer
  return {
    type: 'wrong_values',
    message: 'התוצאה שקיבלת שונה מהצפוי — השווה את הטבלאות למטה',
  }
}

/**
 * Validates that the SQL query ends with exactly one semicolon (the statement terminator).
 * Semicolons inside string literals or comments are ignored.
 * Returns a Hebrew error string if invalid, or null if valid.
 */
export function validateSemicolon(sql: string): string | null {
  const clean = stripCommentsAndStrings(sql).trimEnd()

  if (!clean.endsWith(';')) {
    return (
      'שגיאת תחביר: כל שאילתת SQL חייבת להסתיים בנקודה-פסיק (;)\n' +
      'איפה הבעיה: בסוף השאילתה חסר ;\n' +
      'איך לתקן: הוסף ; ממש לפני שתלחץ "הגש שאילתה"\n' +
      'דוגמה נכונה: SELECT * FROM employees;'
    )
  }

  const semicolonCount = (clean.match(/;/g) ?? []).length
  if (semicolonCount > 1) {
    return (
      'שגיאת תחביר: יש להגיש שאילתה אחת בלבד לכל תרגיל\n' +
      `איפה הבעיה: נמצאו ${semicolonCount} נקודות-פסיק בשאילתה\n` +
      'איך לתקן: כתוב שאילתה אחת בלבד וסיים אותה ב-;\n' +
      'דוגמה נכונה: SELECT * FROM employees;'
    )
  }

  return null
}

/**
 * Returns `sql` guaranteed to end with exactly one trailing semicolon.
 * Used to render the "show solution" text so that copying it verbatim satisfies
 * validateSemicolon — the stored expectedQuery deliberately omits the `;`.
 */
export function withTrailingSemicolon(sql: string): string {
  return sql.replace(/[\s;]+$/, '') + ';'
}

/** Map a required concept to a missing-keyword Hebrew message */
export function missingConceptMessage(keyword: string): string {
  const messages: Record<string, string> = {
    WHERE: 'המשימה מחייבת שימוש ב-WHERE לסינון שורות',
    LIKE: 'המשימה מחייבת שימוש ב-LIKE לחיפוש תבנית בטקסט',
    DISTINCT: 'המשימה מחייבת שימוש ב-DISTINCT להסרת כפילויות',
    'ORDER BY': 'המשימה מחייבת שימוש ב-ORDER BY למיון התוצאות',
    'GROUP BY': 'המשימה מחייבת שימוש ב-GROUP BY לקיבוץ השורות',
    HAVING: 'לאחר GROUP BY, הסינון על קבוצות נעשה עם HAVING — לא WHERE',
    JOIN: 'המשימה מחייבת חיבור טבלאות עם JOIN',
    ON: 'יש להגדיר את תנאי החיבור עם ON',
    BETWEEN: 'המשימה מחייבת שימוש ב-BETWEEN לבדיקת טווח',
    IN: 'המשימה מחייבת שימוש ב-IN לבדיקה מול רשימת ערכים',
  }
  return messages[keyword.toUpperCase()] ?? `המשימה מחייבת שימוש ב-${keyword}`
}
