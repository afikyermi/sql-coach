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

export const level09Exercises: Exercise[] = [
  {
    id: 'level09-ex01',
    levelId: 9,
    title: 'ספירת עובדים',
    description: 'כמה עובדים יש בחברה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT COUNT(*) FROM employees',
    requiredConcepts: [],
    hints: [
      'COUNT(*) סופרת את מספר השורות',
      'SELECT COUNT(*) FROM employees',
      'SELECT COUNT(*) FROM employees',
    ],
    explanation: 'COUNT(*) סופרת את כל השורות בתוצאה. 7 עובדים בטבלה.',
  },
  {
    id: 'level09-ex02',
    levelId: 9,
    title: 'ספירת עובדי IT',
    description: 'כמה עובדים עובדים במחלקת IT?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT COUNT(*) FROM employees WHERE department = 'IT'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'COUNT(*) עם WHERE סופרת שורות שמתאימות לתנאי',
      "WHERE department = 'IT'",
      "SELECT COUNT(*) FROM employees WHERE department = 'IT'",
    ],
    explanation: "COUNT(*) עם WHERE: מחשב רק שורות שעומדות בתנאי. 2 עובדים ב-IT (יוסי ותום).",
  },
  {
    id: 'level09-ex03',
    levelId: 9,
    title: 'סכום משכורות',
    description: 'מה סכום כל המשכורות בחברה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT SUM(salary) FROM employees',
    requiredConcepts: [],
    hints: [
      'SUM() מחשבת סכום של עמודה מספרית',
      'SELECT SUM(salary) FROM employees',
      'SELECT SUM(salary) FROM employees',
    ],
    explanation: 'SUM(salary) מחבר את כל הערכים בעמודת salary. 9000+12000+8500+7500+10000+11000+9500 = 67,500.',
  },
  {
    id: 'level09-ex04',
    levelId: 9,
    title: 'ממוצע משכורות',
    description: 'מה הממוצע של המשכורות בחברה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT AVG(salary) FROM employees',
    requiredConcepts: [],
    hints: [
      'AVG() מחשבת ממוצע',
      'SELECT AVG(salary) FROM employees',
      'SELECT AVG(salary) FROM employees',
    ],
    explanation: 'AVG(salary) = SUM / COUNT = 67500 / 7 ≈ 9643.',
  },
  {
    id: 'level09-ex05',
    levelId: 9,
    title: 'המשכורת הגבוהה ביותר',
    description: 'מה המשכורת הגבוהה ביותר בחברה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT MAX(salary) FROM employees',
    requiredConcepts: [],
    hints: [
      'MAX() מוצאת את הערך המקסימלי',
      'SELECT MAX(salary) FROM employees',
      'SELECT MAX(salary) FROM employees',
    ],
    explanation: 'MAX(salary) מחזירה את הערך הגבוה ביותר בעמודה. יוסי עם 12,000 הוא המקסימום.',
  },
  {
    id: 'level09-ex06',
    levelId: 9,
    title: 'המשכורת הנמוכה ביותר',
    description: 'מה המשכורת הנמוכה ביותר בחברה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT MIN(salary) FROM employees',
    requiredConcepts: [],
    hints: [
      'MIN() מוצאת את הערך המינימלי',
      'SELECT MIN(salary) FROM employees',
      'SELECT MIN(salary) FROM employees',
    ],
    explanation: 'MIN(salary) מחזירה את הערך הנמוך ביותר. אבי עם 7,500 הוא המינימום.',
  },
  {
    id: 'level09-ex07',
    levelId: 9,
    title: 'כינוי לתוצאת הפונקציה',
    description: 'הצג את ממוצע המשכורות עם הכותרת "ממוצע_שכר".',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT AVG(salary) AS ממוצע_שכר FROM employees',
    requiredConcepts: [],
    hints: [
      'AS מאפשר לתת כינוי לתוצאת פונקציה',
      'AVG(salary) AS ממוצע_שכר',
      'SELECT AVG(salary) AS ממוצע_שכר FROM employees',
    ],
    explanation: 'AS נותן שם לתוצאה שמחזירה הפונקציה. במקום כותרת "AVG(salary)" נקבל "ממוצע_שכר".',
  },
  {
    id: 'level09-ex08',
    levelId: 9,
    title: 'ספירת מוצרים יקרים',
    description: 'כמה מוצרים יש במחיר מעל 500 ₪?',
    schema: `
CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT,
  price INTEGER,
  stock INTEGER
);
INSERT INTO products VALUES
  (1, 'מחשב נייד', 3500, 10),
  (2, 'עכבר', 120, 50),
  (3, 'שולחן', 800, 8),
  (4, 'כיסא', 450, 15),
  (5, 'טלפון', 2200, 20);
`,
    sampleData: [{
      tableName: 'products',
      columns: ['product_id', 'product_name', 'price', 'stock'],
      rows: [
        [1, 'מחשב נייד', 3500, 10],
        [2, 'עכבר', 120, 50],
        [3, 'שולחן', 800, 8],
        [4, 'כיסא', 450, 15],
        [5, 'טלפון', 2200, 20],
      ],
    }],
    expectedQuery: "SELECT COUNT(*) AS מספר_מוצרים FROM products WHERE price > 500",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      'COUNT(*) עם WHERE וכינוי AS',
      "COUNT(*) AS מספר_מוצרים",
      "SELECT COUNT(*) AS מספר_מוצרים FROM products WHERE price > 500",
    ],
    explanation: '3 מוצרים מעל 500: מחשב (3500), שולחן (800), טלפון (2200).',
  },
  {
    id: 'level09-ex09',
    levelId: 9,
    title: 'סכום הזמנות',
    description: 'מה הסכום הכולל של כל ההזמנות?',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount INTEGER,
  status TEXT
);
INSERT INTO orders VALUES
  (101, 1, 1200, 'שולם'),
  (102, 2, 450, 'ממתין'),
  (103, 1, 3200, 'שולם'),
  (104, 3, 750, 'בוטל'),
  (105, 4, 980, 'שולם');
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'amount', 'status'],
      rows: [
        [101, 1, 1200, 'שולם'],
        [102, 2, 450, 'ממתין'],
        [103, 1, 3200, 'שולם'],
        [104, 3, 750, 'בוטל'],
        [105, 4, 980, 'שולם'],
      ],
    }],
    expectedQuery: 'SELECT SUM(amount) AS סכום_כולל FROM orders',
    requiredConcepts: [],
    hints: [
      'SUM(amount) מסכמת את כל הסכומים',
      'SELECT SUM(amount) AS סכום_כולל FROM orders',
      'SELECT SUM(amount) AS סכום_כולל FROM orders',
    ],
    explanation: 'SUM(amount): 1200+450+3200+750+980 = 6580.',
  },
  {
    id: 'level09-ex10',
    levelId: 9,
    title: 'כמה הזמנות שולמו?',
    description: 'כמה הזמנות קיבלו סטטוס "שולם"?',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount INTEGER,
  status TEXT
);
INSERT INTO orders VALUES
  (101, 1, 1200, 'שולם'),
  (102, 2, 450, 'ממתין'),
  (103, 1, 3200, 'שולם'),
  (104, 3, 750, 'בוטל'),
  (105, 4, 980, 'שולם');
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'amount', 'status'],
      rows: [
        [101, 1, 1200, 'שולם'],
        [102, 2, 450, 'ממתין'],
        [103, 1, 3200, 'שולם'],
        [104, 3, 750, 'בוטל'],
        [105, 4, 980, 'שולם'],
      ],
    }],
    expectedQuery: "SELECT COUNT(*) AS הזמנות_שולמו FROM orders WHERE status = 'שולם'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' }],
    hints: [
      "WHERE status = 'שולם'",
      "COUNT(*) AS הזמנות_שולמו",
      "SELECT COUNT(*) AS הזמנות_שולמו FROM orders WHERE status = 'שולם'",
    ],
    explanation: "3 הזמנות בסטטוס 'שולם' (101, 103, 105).",
  },
]
