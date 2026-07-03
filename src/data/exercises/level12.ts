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

export const level12Exercises: Exercise[] = [
  {
    id: 'level12-ex01',
    levelId: 12,
    title: 'מחלקות עם ממוצע שכר גבוה',
    description: 'הצג מחלקות שממוצע המשכורת בהן מעל 9,000 ₪.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, AVG(salary) AS ממוצע FROM employees GROUP BY department HAVING AVG(salary) > 9000',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'לסינון לאחר GROUP BY יש להשתמש ב-HAVING' },
    ],
    hints: [
      'HAVING מסנן קבוצות לאחר GROUP BY',
      'HAVING AVG(salary) > 9000',
      'SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 9000',
    ],
    explanation: 'HAVING מסנן קבוצות לאחר הקיבוץ. WHERE לא יכול לעבוד כאן כי הממוצע נחשב רק אחרי GROUP BY. IT (11500) ✓. HR (10000) ✓. שיווק (9000) ✗ — לא עולה על 9000.',
  },
  {
    id: 'level12-ex02',
    levelId: 12,
    title: 'מחלקות עם לפחות 2 עובדים',
    description: 'הצג מחלקות שיש בהן לפחות 2 עובדים.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, COUNT(*) AS מספר_עובדים FROM employees GROUP BY department HAVING COUNT(*) >= 2',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת שימוש ב-GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת שימוש ב-HAVING' },
    ],
    hints: [
      'HAVING COUNT(*) >= 2',
      'GROUP BY department HAVING COUNT(*) >= 2',
      'SELECT department, COUNT(*) AS מספר_עובדים FROM employees GROUP BY department HAVING COUNT(*) >= 2',
    ],
    explanation: 'HAVING COUNT(*) >= 2: מכירות (3) ✓, IT (2) ✓, שיווק (2) ✓, HR (1) ✗.',
  },
  {
    id: 'level12-ex03',
    levelId: 12,
    title: 'WHERE vs HAVING — הבדל ברור',
    description: 'הצג מחלקות שממוצע שכר העובדים שבהם גדול מ-28 הוא מעל 9,500.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, AVG(salary) AS ממוצע FROM employees WHERE age > 28 GROUP BY department HAVING AVG(salary) > 9500',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת WHERE לסינון שורות לפני הקיבוץ' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING לסינון קבוצות' },
    ],
    hints: [
      'WHERE מסנן שורות לפני GROUP BY',
      'HAVING מסנן קבוצות לאחר GROUP BY',
      'SELECT department, AVG(salary) FROM employees WHERE age > 28 GROUP BY department HAVING AVG(salary) > 9500',
    ],
    explanation: 'WHERE age > 28 מסנן שורות תחילה (דנה=28 יוצאת). ואז GROUP BY. ואז HAVING מסנן קבוצות.',
  },
  {
    id: 'level12-ex04',
    levelId: 12,
    title: 'לקוחות עם הרבה הזמנות',
    description: 'הצג לקוחות שביצעו יותר מ-2 הזמנות.',
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
  (106, 2, 600, 'שולם'),
  (107, 1, 400, 'שולם');
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
        [107, 1, 400, 'שולם'],
      ],
    }],
    expectedQuery: 'SELECT customer_id, COUNT(*) AS מספר_הזמנות FROM orders GROUP BY customer_id HAVING COUNT(*) > 2',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'HAVING COUNT(*) > 2',
      'GROUP BY customer_id HAVING COUNT(*) > 2',
      'SELECT customer_id, COUNT(*) FROM orders GROUP BY customer_id HAVING COUNT(*) > 2',
    ],
    explanation: 'לקוח 1: 4 הזמנות ✓. לקוח 2: 2 הזמנות ✗. לקוח 3: 1 הזמנה ✗.',
  },
  {
    id: 'level12-ex05',
    levelId: 12,
    title: 'קטגוריות עם סך מכירות גבוה',
    description: 'הצג קטגוריות שסך המכירות שלהן עולה על 3,000 ₪.',
    schema: `
CREATE TABLE sales (
  sale_id INTEGER PRIMARY KEY,
  category TEXT,
  amount INTEGER
);
INSERT INTO sales VALUES
  (1, 'אלקטרוניקה', 3500),
  (2, 'ריהוט', 800),
  (3, 'אלקטרוניקה', 1200),
  (4, 'ריהוט', 450),
  (5, 'בגדים', 200),
  (6, 'אלקטרוניקה', 2200),
  (7, 'בגדים', 350);
`,
    sampleData: [{
      tableName: 'sales',
      columns: ['sale_id', 'category', 'amount'],
      rows: [
        [1, 'אלקטרוניקה', 3500],
        [2, 'ריהוט', 800],
        [3, 'אלקטרוניקה', 1200],
        [4, 'ריהוט', 450],
        [5, 'בגדים', 200],
        [6, 'אלקטרוניקה', 2200],
        [7, 'בגדים', 350],
      ],
    }],
    expectedQuery: 'SELECT category, SUM(amount) AS סה"כ FROM sales GROUP BY category HAVING SUM(amount) > 3000',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'HAVING SUM(amount) > 3000',
      'GROUP BY category HAVING SUM(amount) > 3000',
      'SELECT category, SUM(amount) FROM sales GROUP BY category HAVING SUM(amount) > 3000',
    ],
    explanation: 'אלקטרוניקה: 6900 > 3000 ✓. ריהוט: 1250 ✗. בגדים: 550 ✗.',
  },
  {
    id: 'level12-ex06',
    levelId: 12,
    title: 'ממוצע ציון לפי קורס (HAVING)',
    description: 'הצג קורסים שממוצע הציון בהם עולה על 82.',
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
  (1, 'פיזיקה', 70),
  (2, 'פיזיקה', 68),
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
        [1, 'פיזיקה', 70],
        [2, 'פיזיקה', 68],
        [3, 'אנגלית', 95],
        [1, 'אנגלית', 88],
      ],
    }],
    expectedQuery: 'SELECT course_name, AVG(grade) AS ממוצע FROM grades GROUP BY course_name HAVING AVG(grade) > 82',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'HAVING AVG(grade) > 82',
      'GROUP BY course_name HAVING AVG(grade) > 82',
      'SELECT course_name, AVG(grade) FROM grades GROUP BY course_name HAVING AVG(grade) > 82',
    ],
    explanation: 'מתמטיקה≈83.3 ✓. אנגלית≈91.5 ✓. פיזיקה=69 ✗.',
  },
  {
    id: 'level12-ex07',
    levelId: 12,
    title: 'HAVING עם ORDER BY',
    description: 'הצג מחלקות עם יותר מעובד אחד, ממוינות מהגדולה לקטנה.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, COUNT(*) AS מספר_עובדים FROM employees GROUP BY department HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת ORDER BY' },
    ],
    hints: [
      'סדר: GROUP BY → HAVING → ORDER BY',
      'HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC',
      'SELECT department, COUNT(*) FROM employees GROUP BY department HAVING COUNT(*) > 1 ORDER BY COUNT(*) DESC',
    ],
    explanation: 'HAVING מסנן קבוצות עם יותר מ-1 עובד, ORDER BY ממיין את הקבוצות שנשארו.',
  },
  {
    id: 'level12-ex08',
    levelId: 12,
    title: 'ערים עם מספר לקוחות מינימלי',
    description: 'הצג ערים שיש בהן לפחות 2 לקוחות שונים.',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  city TEXT,
  amount INTEGER
);
INSERT INTO orders VALUES
  (1, 1, 'תל אביב', 500),
  (2, 2, 'חיפה', 300),
  (3, 3, 'תל אביב', 700),
  (4, 1, 'תל אביב', 200),
  (5, 4, 'חיפה', 400),
  (6, 5, 'ירושלים', 600);
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'city', 'amount'],
      rows: [
        [1, 1, 'תל אביב', 500],
        [2, 2, 'חיפה', 300],
        [3, 3, 'תל אביב', 700],
        [4, 1, 'תל אביב', 200],
        [5, 4, 'חיפה', 400],
        [6, 5, 'ירושלים', 600],
      ],
    }],
    expectedQuery: 'SELECT city, COUNT(DISTINCT customer_id) AS לקוחות FROM orders GROUP BY city HAVING COUNT(DISTINCT customer_id) >= 2',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'COUNT(DISTINCT customer_id) סופר לקוחות ייחודיים',
      'HAVING COUNT(DISTINCT customer_id) >= 2',
      'SELECT city, COUNT(DISTINCT customer_id) FROM orders GROUP BY city HAVING COUNT(DISTINCT customer_id) >= 2',
    ],
    explanation: 'COUNT(DISTINCT) בתוך HAVING: תל אביב (לקוחות 1,3=2) ✓. חיפה (לקוחות 2,4=2) ✓. ירושלים (לקוח 5=1) ✗.',
  },
  {
    id: 'level12-ex09',
    levelId: 12,
    title: 'WHERE + GROUP BY + HAVING',
    description: 'הצג מחלקות (שאינן HR) שממוצע שכרן מעל 9,000 ₪.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT department, AVG(salary) AS ממוצע FROM employees WHERE department <> 'HR' GROUP BY department HAVING AVG(salary) > 9000",
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת WHERE' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      "WHERE department <> 'HR' מסנן לפני הקיבוץ",
      'HAVING AVG(salary) > 9000 מסנן לאחר הקיבוץ',
      "SELECT department, AVG(salary) FROM employees WHERE department <> 'HR' GROUP BY department HAVING AVG(salary) > 9000",
    ],
    explanation: 'WHERE מוציא HR תחילה. GROUP BY מקבץ. HAVING מסנן ממוצע > 9000. IT (11500) ✓. שיווק (9000 = לא מעל) ✗.',
  },
  {
    id: 'level12-ex10',
    levelId: 12,
    title: 'שאלת הבנה: WHERE vs HAVING',
    description: 'הצג מחלקות שיש בהן עובדים עם שכר מעל 9,000 — ספור רק עובדים כאלה, והצג מחלקות עם יותר מ-1 עובד כזה.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, COUNT(*) AS עובדים_עם_שכר_גבוה FROM employees WHERE salary > 9000 GROUP BY department HAVING COUNT(*) > 1',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת WHERE לסינון שורות לפני הקיבוץ' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING לסינון קבוצות' },
    ],
    hints: [
      'WHERE salary > 9000 מסנן תחילה',
      'HAVING COUNT(*) > 1 מסנן קבוצות בסוף',
      'SELECT department, COUNT(*) FROM employees WHERE salary > 9000 GROUP BY department HAVING COUNT(*) > 1',
    ],
    explanation: 'WHERE salary > 9000 מסנן 4 עובדים: יוסי (IT), רות (HR), תום (IT), ענת (שיווק). GROUP BY מקבץ. IT=2 ✓. HR=1 ✗. שיווק=1 ✗.',
  },
  {
    id: 'level12-ex11',
    levelId: 12,
    title: 'ממוצע הזמנות לפי לקוח',
    description: 'הצג לקוחות שממוצע הסכום של הזמנותיהם עולה על 1,000 ₪.',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  amount INTEGER
);
INSERT INTO orders VALUES
  (101, 1, 1200),
  (102, 2, 450),
  (103, 1, 3200),
  (104, 3, 750),
  (105, 1, 980),
  (106, 2, 600),
  (107, 3, 850);
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'amount'],
      rows: [
        [101, 1, 1200],
        [102, 2, 450],
        [103, 1, 3200],
        [104, 3, 750],
        [105, 1, 980],
        [106, 2, 600],
        [107, 3, 850],
      ],
    }],
    expectedQuery: 'SELECT customer_id, AVG(amount) AS ממוצע FROM orders GROUP BY customer_id HAVING AVG(amount) > 1000',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'GROUP BY customer_id',
      'HAVING AVG(amount) > 1000',
      'SELECT customer_id, AVG(amount) FROM orders GROUP BY customer_id HAVING AVG(amount) > 1000',
    ],
    explanation: 'לקוח 1: (1200+3200+980)/3=1793 ✓. לקוח 2: (450+600)/2=525 ✗. לקוח 3: (750+850)/2=800 ✗.',
  },
  {
    id: 'level12-ex12',
    levelId: 12,
    title: 'מחלקות עם שכר מקסימלי גבוה',
    description: 'הצג מחלקות שהשכר הגבוה ביותר בהן עולה על 10,000 ₪.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT department, MAX(salary) AS שכר_מקסימלי FROM employees GROUP BY department HAVING MAX(salary) > 10000',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'HAVING MAX(salary) > 10000',
      'GROUP BY department HAVING MAX(salary) > 10000',
      'SELECT department, MAX(salary) FROM employees GROUP BY department HAVING MAX(salary) > 10000',
    ],
    explanation: 'IT: MAX=12000 ✓. מכירות: MAX=9000 ✗. שיווק: MAX=9500 ✗. HR: MAX=10000 ✗ (לא מעל 10000).',
  },
]
