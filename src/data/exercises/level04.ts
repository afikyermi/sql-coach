import type { Exercise } from '../../types'

const empSchema = `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  department TEXT,
  salary INTEGER,
  age INTEGER
);
INSERT INTO employees VALUES
  (1, 'דנה', 'לוי', 'מכירות', 9000, 28),
  (2, 'יוסי', 'כהן', 'IT', 12000, 35),
  (3, 'מיכל', 'אברהם', 'שיווק', 8500, 31),
  (4, 'אבי', 'ברק', 'מכירות', 7500, 25),
  (5, 'רות', 'גלעד', 'HR', 10000, 42),
  (6, 'תום', 'דוד', 'IT', 11000, 29),
  (7, 'ענת', 'מזרחי', 'שיווק', 9500, 38);
`
const empSample = [{
  tableName: 'employees',
  columns: ['employee_id', 'first_name', 'last_name', 'department', 'salary', 'age'],
  rows: [
    [1, 'דנה', 'לוי', 'מכירות', 9000, 28],
    [2, 'יוסי', 'כהן', 'IT', 12000, 35],
    [3, 'מיכל', 'אברהם', 'שיווק', 8500, 31],
    [4, 'אבי', 'ברק', 'מכירות', 7500, 25],
    [5, 'רות', 'גלעד', 'HR', 10000, 42],
    [6, 'תום', 'דוד', 'IT', 11000, 29],
    [7, 'ענת', 'מזרחי', 'שיווק', 9500, 38],
  ],
}]

export const level04Exercises: Exercise[] = [
  {
    id: 'level04-ex01',
    levelId: 4,
    title: 'IT ומשכורת גבוהה',
    description: 'הצג עובדים שעובדים במחלקת IT וגם משכורתם מעל 10,000 ₪.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department = 'IT' AND salary > 10000",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'AND מחייב ששני התנאים יתקיימו',
      "WHERE department = 'IT' AND salary > 10000",
      "SELECT * FROM employees WHERE department = 'IT' AND salary > 10000",
    ],
    explanation: "AND מחזיר שורות שבהן כל התנאים נכונים. יוסי (IT, 12000) ✓. תום (IT, 11000) ✓. מיכל (שיווק) ✗.",
  },
  {
    id: 'level04-ex02',
    levelId: 4,
    title: 'מכירות OR HR',
    description: 'הצג עובדים ממחלקת מכירות או ממחלקת HR.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department = 'מכירות' OR department = 'HR'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'OR מספיק שאחד מהתנאים יתקיים',
      "WHERE department = 'מכירות' OR department = 'HR'",
      "SELECT * FROM employees WHERE department = 'מכירות' OR department = 'HR'",
    ],
    explanation: "OR מחזיר שורות שבהן לפחות אחד מהתנאים נכון. דנה ואבי (מכירות) ✓. רות (HR) ✓.",
  },
  {
    id: 'level04-ex03',
    levelId: 4,
    title: 'NOT IT',
    description: 'הצג את כל העובדים שאינם במחלקת IT.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE NOT department = 'IT'",    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'NOT הופך תנאי — NOT department = \'IT\' מחזיר כל מי שאינו IT',
      "WHERE NOT department = 'IT'",
      "SELECT * FROM employees WHERE NOT department = 'IT'",
    ],
    explanation: "NOT הופך את התוצאה של התנאי. גם WHERE department <> 'IT' נותן את אותה תוצאה.",
  },
  {
    id: 'level04-ex04',
    levelId: 4,
    title: 'צעיר ובמכירות',
    description: 'הצג עובדים שגילם פחות מ-30 וגם עובדים במכירות.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT first_name, age, department FROM employees WHERE age < 30 AND department = 'מכירות'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'שני תנאים: גיל < 30 ומחלקה = מכירות',
      'חבר אותם עם AND',
      "SELECT first_name, age, department FROM employees WHERE age < 30 AND department = 'מכירות'",
    ],
    explanation: "AND מחייב ששני התנאים יתקיימו בו זמנית. אבי (25, מכירות) ✓. דנה (28, מכירות) ✓. יוסי (35, IT) ✗.",
  },
  {
    id: 'level04-ex05',
    levelId: 4,
    title: 'שכר גבוה OR שיווק',
    description: 'הצג עובדים שמשכורתם מעל 10,000 ₪ או שעובדים בשיווק.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE salary > 10000 OR department = 'שיווק'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'OR מחזיר שורות שמקיימות לפחות תנאי אחד',
      "WHERE salary > 10000 OR department = 'שיווק'",
      "SELECT * FROM employees WHERE salary > 10000 OR department = 'שיווק'",
    ],
    explanation: "OR מחזיר שורות שבהן לפחות אחד מהתנאים נכון. יוסי (12000 > 10000) ✓. תום (11000 > 10000) ✓. מיכל (שיווק) ✓. ענת (שיווק) ✓.",
  },
  {
    id: 'level04-ex06',
    levelId: 4,
    title: 'סוגריים לקביעת סדר',
    description: 'הצג עובדים שעובדים ב-IT או בשיווק, וגם גילם מעל 30.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE (department = 'IT' OR department = 'שיווק') AND age > 30",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'סוגריים קובעים את סדר הבדיקה',
      'קודם בדוק (IT OR שיווק), ואז AND גיל > 30',
      "SELECT * FROM employees WHERE (department = 'IT' OR department = 'שיווק') AND age > 30",
    ],
    explanation: "סוגריים גורמים ל-OR להיבדק ראשון. ואז AND מוחל על התוצאה. יוסי (IT, 35) ✓. מיכל (שיווק, 31) ✓. ענת (שיווק, 38) ✓.",
  },
  {
    id: 'level04-ex07',
    levelId: 4,
    title: 'שלושה תנאים',
    description: 'הצג עובדים שגילם בין 25 ל-35 (כלומר: גיל >= 25 AND גיל <= 35) וגם משכורתם מעל 8,000.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees WHERE age >= 25 AND age <= 35 AND salary > 8000',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'ניתן לשרשר מספר תנאי AND',
      'WHERE age >= 25 AND age <= 35 AND salary > 8000',
      'SELECT * FROM employees WHERE age >= 25 AND age <= 35 AND salary > 8000',
    ],
    explanation: 'ניתן לשרשר כמה תנאי AND שרוצים. כל שלושת התנאים חייבים להתקיים.',
  },
  {
    id: 'level04-ex08',
    levelId: 4,
    title: 'NOT עם AND',
    description: 'הצג עובדים שאינם במחלקת מכירות וגם גילם מעל 30.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department <> 'מכירות' AND age > 30",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      '"אינם במכירות" = department <> \'מכירות\'',
      'AND מחבר בין שני התנאים',
      "SELECT * FROM employees WHERE department <> 'מכירות' AND age > 30",
    ],
    explanation: "שילוב של 'לא שווה' (<>) עם AND. יוסי (IT, 35) ✓. רות (HR, 42) ✓. ענת (שיווק, 38) ✓.",
  },
  {
    id: 'level04-ex09',
    levelId: 4,
    title: 'IT צעיר OR HR בכיר',
    description: 'הצג עובדים שהם: (עובדים ב-IT וגילם פחות מ-32) או (עובדים ב-HR).',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE (department = 'IT' AND age < 32) OR department = 'HR'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'שילוב AND בתוך OR מחייב סוגריים',
      "(department = 'IT' AND age < 32) OR department = 'HR'",
      "SELECT * FROM employees WHERE (department = 'IT' AND age < 32) OR department = 'HR'",
    ],
    explanation: "הסוגריים אומרים: קודם בדוק IT AND גיל < 32, ואז OR HR. תום (IT, 29) ✓. רות (HR, 42) ✓. יוסי (IT, 35) ✗ כי 35 >= 32.",
  },
  {
    id: 'level04-ex10',
    levelId: 4,
    title: 'סינון מוצרים מרובה תנאים',
    description: 'הצג מוצרים שמחירם מעל 200 ₪ וגם מלאי מעל 10 יחידות.',
    schema: `
CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT,
  category TEXT,
  price INTEGER,
  stock INTEGER
);
INSERT INTO products VALUES
  (1, 'מחשב נייד', 'אלקטרוניקה', 3500, 10),
  (2, 'עכבר', 'אלקטרוניקה', 120, 50),
  (3, 'שולחן', 'ריהוט', 800, 8),
  (4, 'כיסא', 'ריהוט', 450, 15),
  (5, 'טלפון', 'אלקטרוניקה', 2200, 20);
`,
    sampleData: [{
      tableName: 'products',
      columns: ['product_id', 'product_name', 'category', 'price', 'stock'],
      rows: [
        [1, 'מחשב נייד', 'אלקטרוניקה', 3500, 10],
        [2, 'עכבר', 'אלקטרוניקה', 120, 50],
        [3, 'שולחן', 'ריהוט', 800, 8],
        [4, 'כיסא', 'ריהוט', 450, 15],
        [5, 'טלפון', 'אלקטרוניקה', 2200, 20],
      ],
    }],
    expectedQuery: 'SELECT * FROM products WHERE price > 200 AND stock > 10',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'שני תנאים: price > 200 AND stock > 10',
      'WHERE price > 200 AND stock > 10',
      'SELECT * FROM products WHERE price > 200 AND stock > 10',
    ],
    explanation: 'AND מחייב ששני התנאים נכונים. כיסא (450, 15) ✓. טלפון (2200, 20) ✓. מחשב נייד (3500, 10) ✗ כי stock = 10.',
  },
]
