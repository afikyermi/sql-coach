import type { Exercise } from '../../types'

const empSchema = `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER,
  age INTEGER
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000, 28),
  (2, 'יוסי', 'IT', 12000, 35),
  (3, 'מיכל', 'שיווק', 8500, 31),
  (4, 'אבי', 'מכירות', 7500, 25),
  (5, 'רות', 'HR', 10000, 42),
  (6, 'תום', 'IT', 11000, 29),
  (7, 'ענת', 'שיווק', 9500, 38),
  (8, 'גיל', 'מכירות', 8000, 33);
`
const empSample = [{
  tableName: 'employees',
  columns: ['employee_id', 'first_name', 'department', 'salary', 'age'],
  rows: [
    [1, 'דנה', 'מכירות', 9000, 28],
    [2, 'יוסי', 'IT', 12000, 35],
    [3, 'מיכל', 'שיווק', 8500, 31],
    [4, 'אבי', 'מכירות', 7500, 25],
    [5, 'רות', 'HR', 10000, 42],
    [6, 'תום', 'IT', 11000, 29],
    [7, 'ענת', 'שיווק', 9500, 38],
    [8, 'גיל', 'מכירות', 8000, 33],
  ],
}]

export const level11Exercises: Exercise[] = [
  {
    id: 'level11-ex01',
    levelId: 11,
    title: 'ספירה לפי מחלקה',
    description: 'כמה עובדים יש בכל מחלקה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, COUNT(*) FROM employees GROUP BY department',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'GROUP BY מקבץ שורות עם ערך זהה',
      'COUNT(*) סופרת כמה שורות בכל קבוצה',
      'SELECT department, COUNT(*) FROM employees GROUP BY department',
    ],
    explanation: 'GROUP BY department יוצרת קבוצה לכל מחלקה. COUNT(*) סופרת כמה עובדים בכל קבוצה.',
  },
  {
    id: 'level11-ex02',
    levelId: 11,
    title: 'ממוצע שכר לפי מחלקה',
    description: 'מה ממוצע המשכורת בכל מחלקה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, AVG(salary) AS ממוצע_שכר FROM employees GROUP BY department',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'AVG(salary) מחשבת ממוצע',
      'GROUP BY department',
      'SELECT department, AVG(salary) AS ממוצע_שכר FROM employees GROUP BY department',
    ],
    explanation: 'GROUP BY + AVG: מחשב ממוצע שכר לכל מחלקה בנפרד.',
  },
  {
    id: 'level11-ex03',
    levelId: 11,
    title: 'סכום שכר לפי מחלקה',
    description: 'מה סכום כל המשכורות בכל מחלקה?',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, SUM(salary) AS סה"כ_שכר FROM employees GROUP BY department',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'SUM(salary) מחשבת סכום',
      'GROUP BY department',
      'SELECT department, SUM(salary) FROM employees GROUP BY department',
    ],
    explanation: 'GROUP BY + SUM: מחשב את סכום השכר הכולל של כל מחלקה.',
  },
  {
    id: 'level11-ex04',
    levelId: 11,
    title: 'מינימום ומקסימום לפי מחלקה',
    description: 'הצג את השכר הנמוך ביותר והגבוה ביותר בכל מחלקה.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, MIN(salary) AS שכר_מינימלי, MAX(salary) AS שכר_מקסימלי FROM employees GROUP BY department',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'MIN ו-MAX בשורת SELECT אחת',
      'GROUP BY department',
      'SELECT department, MIN(salary), MAX(salary) FROM employees GROUP BY department',
    ],
    explanation: 'ניתן להשתמש במספר פונקציות אגרגציה בשאילתה אחת עם GROUP BY.',
  },
  {
    id: 'level11-ex05',
    levelId: 11,
    title: 'WHERE לפני GROUP BY',
    description: 'הצג את מספר העובדים בכל מחלקה — אבל רק עובדים עם משכורת מעל 8,000.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, COUNT(*) AS מספר_עובדים FROM employees WHERE salary > 8000 GROUP BY department',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לפני GROUP BY' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' },
    ],
    hints: [
      'WHERE חייב להופיע לפני GROUP BY',
      'WHERE salary > 8000 GROUP BY department',
      'SELECT department, COUNT(*) AS מספר_עובדים FROM employees WHERE salary > 8000 GROUP BY department',
    ],
    explanation: 'סדר חשוב: WHERE מסנן שורות בודדות לפני הקיבוץ. GROUP BY מקבץ אחר כך.',
  },
  {
    id: 'level11-ex06',
    levelId: 11,
    title: 'ספירת הזמנות לפי לקוח',
    description: 'כמה הזמנות ביצע כל לקוח?',
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
  (105, 1, 980, 'שולם'),
  (106, 2, 600, 'שולם');
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'amount', 'status'],
      rows: [
        [101, 1, 1200, 'שולם'],
        [102, 2, 450, 'ממתין'],
        [103, 1, 3200, 'שולם'],
        [104, 3, 750, 'בוטל'],
        [105, 1, 980, 'שולם'],
        [106, 2, 600, 'שולם'],
      ],
    }],
    expectedQuery: 'SELECT customer_id, COUNT(*) AS מספר_הזמנות FROM orders GROUP BY customer_id',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'GROUP BY customer_id',
      'COUNT(*) AS מספר_הזמנות',
      'SELECT customer_id, COUNT(*) AS מספר_הזמנות FROM orders GROUP BY customer_id',
    ],
    explanation: 'GROUP BY customer_id + COUNT(*): לקוח 1 — 3 הזמנות, לקוח 2 — 2 הזמנות, לקוח 3 — 1 הזמנה.',
  },
  {
    id: 'level11-ex07',
    levelId: 11,
    title: 'סכום מכירות לפי קטגוריה',
    description: 'הצג את סכום המכירות לכל קטגוריה.',
    schema: `
CREATE TABLE sales (
  sale_id INTEGER PRIMARY KEY,
  category TEXT,
  amount INTEGER,
  sale_date TEXT
);
INSERT INTO sales VALUES
  (1, 'אלקטרוניקה', 3500, '2024-01-10'),
  (2, 'ריהוט', 800, '2024-01-15'),
  (3, 'אלקטרוניקה', 1200, '2024-02-01'),
  (4, 'ריהוט', 450, '2024-02-10'),
  (5, 'בגדים', 200, '2024-02-20'),
  (6, 'אלקטרוניקה', 2200, '2024-03-05'),
  (7, 'בגדים', 350, '2024-03-10');
`,
    sampleData: [{
      tableName: 'sales',
      columns: ['sale_id', 'category', 'amount', 'sale_date'],
      rows: [
        [1, 'אלקטרוניקה', 3500, '2024-01-10'],
        [2, 'ריהוט', 800, '2024-01-15'],
        [3, 'אלקטרוניקה', 1200, '2024-02-01'],
        [4, 'ריהוט', 450, '2024-02-10'],
        [5, 'בגדים', 200, '2024-02-20'],
        [6, 'אלקטרוניקה', 2200, '2024-03-05'],
        [7, 'בגדים', 350, '2024-03-10'],
      ],
    }],
    expectedQuery: 'SELECT category, SUM(amount) AS סה"כ_מכירות FROM sales GROUP BY category',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'GROUP BY category',
      'SUM(amount) לסכום המכירות',
      'SELECT category, SUM(amount) FROM sales GROUP BY category',
    ],
    explanation: 'GROUP BY category + SUM: אלקטרוניקה=6900, ריהוט=1250, בגדים=550.',
  },
  {
    id: 'level11-ex08',
    levelId: 11,
    title: 'ממוצע ציון לפי קורס',
    description: 'הצג את ממוצע הציון לכל קורס.',
    schema: `
CREATE TABLE grades (
  student_id INTEGER,
  course_name TEXT,
  grade INTEGER
);
INSERT INTO grades VALUES
  (1, 'מתמטיקה', 90),
  (2, 'מתמטיקה', 75),
  (3, 'מתמטיקה', 85),
  (1, 'פיזיקה', 80),
  (2, 'פיזיקה', 70),
  (3, 'אנגלית', 95),
  (1, 'אנגלית', 88);
`,
    sampleData: [{
      tableName: 'grades',
      columns: ['student_id', 'course_name', 'grade'],
      rows: [
        [1, 'מתמטיקה', 90],
        [2, 'מתמטיקה', 75],
        [3, 'מתמטיקה', 85],
        [1, 'פיזיקה', 80],
        [2, 'פיזיקה', 70],
        [3, 'אנגלית', 95],
        [1, 'אנגלית', 88],
      ],
    }],
    expectedQuery: 'SELECT course_name, AVG(grade) AS ממוצע_ציון FROM grades GROUP BY course_name',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'GROUP BY course_name',
      'AVG(grade) AS ממוצע_ציון',
      'SELECT course_name, AVG(grade) AS ממוצע_ציון FROM grades GROUP BY course_name',
    ],
    explanation: 'GROUP BY course_name + AVG(grade): מתמטיקה≈83, פיזיקה=75, אנגלית≈91.5.',
  },
  {
    id: 'level11-ex09',
    levelId: 11,
    title: 'מיון לאחר GROUP BY',
    description: 'הצג את מספר העובדים בכל מחלקה, ממוין מהמחלקה הגדולה לקטנה.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, COUNT(*) AS מספר_עובדים FROM employees GROUP BY department ORDER BY מספר_עובדים DESC',    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' },
    ],
    hints: [
      'GROUP BY קודם, ORDER BY אחר כך',
      'ORDER BY COUNT(*) DESC',
      'SELECT department, COUNT(*) AS מספר_עובדים FROM employees GROUP BY department ORDER BY COUNT(*) DESC',
    ],
    explanation: 'ORDER BY אחרי GROUP BY ממיין את הקבוצות. מכירות (3) > IT (2) = שיווק (2) > HR (1).',
  },
  {
    id: 'level11-ex10',
    levelId: 11,
    title: 'ספירת הזמנות לפי סטטוס',
    description: 'כמה הזמנות יש בכל סטטוס?',
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
  (105, 1, 980, 'שולם'),
  (106, 2, 600, 'ממתין');
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'amount', 'status'],
      rows: [
        [101, 1, 1200, 'שולם'],
        [102, 2, 450, 'ממתין'],
        [103, 1, 3200, 'שולם'],
        [104, 3, 750, 'בוטל'],
        [105, 1, 980, 'שולם'],
        [106, 2, 600, 'ממתין'],
      ],
    }],
    expectedQuery: 'SELECT status, COUNT(*) AS מספר_הזמנות FROM orders GROUP BY status',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'GROUP BY status',
      'COUNT(*) AS מספר_הזמנות',
      'SELECT status, COUNT(*) AS מספר_הזמנות FROM orders GROUP BY status',
    ],
    explanation: 'GROUP BY status: שולם=3, ממתין=2, בוטל=1.',
  },
  {
    id: 'level11-ex11',
    levelId: 11,
    title: 'ספירה לפי עיר',
    description: 'כמה לקוחות יש בכל עיר?',
    schema: `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT,
  city TEXT
);
INSERT INTO customers VALUES
  (1, 'עמית', 'תל אביב'),
  (2, 'לילה', 'חיפה'),
  (3, 'בן', 'ירושלים'),
  (4, 'נועה', 'תל אביב'),
  (5, 'כרמל', 'באר שבע'),
  (6, 'שגב', 'תל אביב'),
  (7, 'דינה', 'חיפה');
`,
    sampleData: [{
      tableName: 'customers',
      columns: ['customer_id', 'first_name', 'city'],
      rows: [
        [1, 'עמית', 'תל אביב'],
        [2, 'לילה', 'חיפה'],
        [3, 'בן', 'ירושלים'],
        [4, 'נועה', 'תל אביב'],
        [5, 'כרמל', 'באר שבע'],
        [6, 'שגב', 'תל אביב'],
        [7, 'דינה', 'חיפה'],
      ],
    }],
    expectedQuery: 'SELECT city, COUNT(*) AS מספר_לקוחות FROM customers GROUP BY city',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'GROUP BY city',
      'SELECT city, COUNT(*) AS מספר_לקוחות FROM customers GROUP BY city',
      'SELECT city, COUNT(*) AS מספר_לקוחות FROM customers GROUP BY city',
    ],
    explanation: 'תל אביב=3, חיפה=2, ירושלים=1, באר שבע=1.',
  },
  {
    id: 'level11-ex12',
    levelId: 11,
    title: 'WHERE + GROUP BY + ORDER BY',
    description: 'הצג את ממוצע השכר לכל מחלקה — רק עובדים מעל גיל 25 — ממוין מהממוצע הגבוה לנמוך.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, AVG(salary) AS ממוצע_שכר FROM employees WHERE age > 25 GROUP BY department ORDER BY AVG(salary) DESC',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' },
    ],
    hints: [
      'סדר: WHERE → GROUP BY → ORDER BY',
      'WHERE age > 25 GROUP BY department ORDER BY AVG(salary) DESC',
      'SELECT department, AVG(salary) AS ממוצע_שכר FROM employees WHERE age > 25 GROUP BY department ORDER BY AVG(salary) DESC',
    ],
    explanation: 'שלב מלא: WHERE מסנן, GROUP BY מקבץ, AVG מחשב, ORDER BY ממיין. אבי (25) לא ייכלל.',
  },
  {
    id: 'level11-ex13',
    levelId: 11,
    title: 'קיבוץ לפי שנה (GROUP BY עם פונקציית תאריך)',
    description: 'כמה הזמנות בוצעו בכל שנה? קבץ את ההזמנות לפי השנה של order_date.',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  amount INTEGER
);
INSERT INTO orders VALUES
  (101, 1, '2023-05-10', 1200),
  (102, 2, '2023-08-20', 450),
  (103, 1, '2024-01-15', 3200),
  (104, 3, '2024-02-10', 750),
  (105, 1, '2024-03-05', 980);
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'order_date', 'amount'],
      rows: [
        [101, 1, '2023-05-10', 1200],
        [102, 2, '2023-08-20', 450],
        [103, 1, '2024-01-15', 3200],
        [104, 3, '2024-02-10', 750],
        [105, 1, '2024-03-05', 980],
      ],
    }],
    expectedQuery: 'SELECT YEAR(order_date) AS שנה, COUNT(*) AS מספר_הזמנות FROM orders GROUP BY YEAR(order_date)',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' }],
    hints: [
      'אפשר לקבץ לפי חלק מתאריך, לא רק לפי עמודה שלמה — YEAR() מחלץ את השנה',
      'GROUP BY YEAR(order_date) מקבץ יחד את כל ההזמנות מאותה שנה',
      'המבנה: SELECT YEAR(order_date) AS שנה, COUNT(*) AS ... FROM orders GROUP BY YEAR(order_date)',
    ],
    explanation: 'ניתן לקבץ לפי ביטוי מחושב ולא רק לפי עמודה. YEAR(order_date) מחלץ את השנה, ו-GROUP BY מקבץ לפיה: 2023 → 2 הזמנות, 2024 → 3 הזמנות.',
  },
]
