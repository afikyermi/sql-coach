import type { Exercise } from '../../types'

export const level07Exercises: Exercise[] = [
  {
    id: 'level07-ex01',
    levelId: 7,
    title: 'מחלקות ייחודיות',
    description: 'הצג את כל המחלקות הקיימות בחברה — כל מחלקה פעם אחת בלבד.',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000),
  (2, 'יוסי', 'IT', 12000),
  (3, 'מיכל', 'שיווק', 8500),
  (4, 'אבי', 'מכירות', 7500),
  (5, 'רות', 'HR', 10000),
  (6, 'תום', 'IT', 11000),
  (7, 'ענת', 'שיווק', 9500);
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'salary'],
      rows: [
        [1, 'דנה', 'מכירות', 9000],
        [2, 'יוסי', 'IT', 12000],
        [3, 'מיכל', 'שיווק', 8500],
        [4, 'אבי', 'מכירות', 7500],
        [5, 'רות', 'HR', 10000],
        [6, 'תום', 'IT', 11000],
        [7, 'ענת', 'שיווק', 9500],
      ],
    }],
    expectedQuery: 'SELECT DISTINCT department FROM employees',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT להסרת כפילויות' }],
    hints: [
      'DISTINCT מסנן כפילויות ומציג כל ערך פעם אחת',
      'SELECT DISTINCT department...',
      'SELECT DISTINCT department FROM employees',
    ],
    explanation: 'ללא DISTINCT היינו מקבלים 7 שורות (עם כפילויות). עם DISTINCT מקבלים 4 מחלקות ייחודיות.',
  },
  {
    id: 'level07-ex02',
    levelId: 7,
    title: 'ערים ייחודיות',
    description: 'הצג את כל הערים שיש בהן לקוחות — כל עיר פעם אחת.',
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
    expectedQuery: 'SELECT DISTINCT city FROM customers',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT' }],
    hints: [
      'DISTINCT city יציג כל עיר פעם אחת',
      'SELECT DISTINCT city FROM customers',
      'SELECT DISTINCT city FROM customers',
    ],
    explanation: '7 לקוחות ב-4 ערים. DISTINCT מצמצם ל-4 שורות ייחודיות.',
  },
  {
    id: 'level07-ex03',
    levelId: 7,
    title: 'DISTINCT עם WHERE',
    description: 'הצג את המחלקות הייחודיות של עובדים עם משכורת מעל 9,000 ₪.',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000),
  (2, 'יוסי', 'IT', 12000),
  (3, 'מיכל', 'שיווק', 8500),
  (4, 'אבי', 'מכירות', 7500),
  (5, 'רות', 'HR', 10000),
  (6, 'תום', 'IT', 11000),
  (7, 'ענת', 'שיווק', 9500);
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'salary'],
      rows: [
        [1, 'דנה', 'מכירות', 9000],
        [2, 'יוסי', 'IT', 12000],
        [3, 'מיכל', 'שיווק', 8500],
        [4, 'אבי', 'מכירות', 7500],
        [5, 'רות', 'HR', 10000],
        [6, 'תום', 'IT', 11000],
        [7, 'ענת', 'שיווק', 9500],
      ],
    }],
    expectedQuery: 'SELECT DISTINCT department FROM employees WHERE salary > 9000',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT' },
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' },
    ],
    hints: [
      'WHERE מסנן תחילה, אחר כך DISTINCT מסיר כפילויות',
      'WHERE salary > 9000',
      'SELECT DISTINCT department FROM employees WHERE salary > 9000',
    ],
    explanation: 'קודם WHERE מסנן עובדים עם salary > 9000, ואז DISTINCT מוחק כפילויות. IT ו-HR ו-שיווק יוחזרו.',
  },
  {
    id: 'level07-ex04',
    levelId: 7,
    title: 'COUNT(DISTINCT)',
    description: 'כמה מחלקות שונות קיימות בחברה?',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000),
  (2, 'יוסי', 'IT', 12000),
  (3, 'מיכל', 'שיווק', 8500),
  (4, 'אבי', 'מכירות', 7500),
  (5, 'רות', 'HR', 10000),
  (6, 'תום', 'IT', 11000),
  (7, 'ענת', 'שיווק', 9500);
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'salary'],
      rows: [
        [1, 'דנה', 'מכירות', 9000],
        [2, 'יוסי', 'IT', 12000],
        [3, 'מיכל', 'שיווק', 8500],
        [4, 'אבי', 'מכירות', 7500],
        [5, 'רות', 'HR', 10000],
        [6, 'תום', 'IT', 11000],
        [7, 'ענת', 'שיווק', 9500],
      ],
    }],
    expectedQuery: 'SELECT COUNT(DISTINCT department) FROM employees',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT בתוך COUNT' }],
    hints: [
      'COUNT סופר שורות, DISTINCT בתוכו סופר ערכים ייחודיים',
      'COUNT(DISTINCT department)',
      'SELECT COUNT(DISTINCT department) FROM employees',
    ],
    explanation: 'COUNT(DISTINCT department) סופר כמה ערכים ייחודיים יש בעמודת department. 4 מחלקות: מכירות, IT, שיווק, HR.',
  },
  {
    id: 'level07-ex05',
    levelId: 7,
    title: 'קטגוריות ייחודיות',
    description: 'הצג את כל הקטגוריות הקיימות בטבלת המוצרים.',
    schema: `
CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT,
  category TEXT,
  price INTEGER
);
INSERT INTO products VALUES
  (1, 'מחשב נייד', 'אלקטרוניקה', 3500),
  (2, 'עכבר', 'אלקטרוניקה', 120),
  (3, 'שולחן', 'ריהוט', 800),
  (4, 'כיסא', 'ריהוט', 450),
  (5, 'טלפון', 'אלקטרוניקה', 2200),
  (6, 'ספה', 'ריהוט', 1500);
`,
    sampleData: [{
      tableName: 'products',
      columns: ['product_id', 'product_name', 'category', 'price'],
      rows: [
        [1, 'מחשב נייד', 'אלקטרוניקה', 3500],
        [2, 'עכבר', 'אלקטרוניקה', 120],
        [3, 'שולחן', 'ריהוט', 800],
        [4, 'כיסא', 'ריהוט', 450],
        [5, 'טלפון', 'אלקטרוניקה', 2200],
        [6, 'ספה', 'ריהוט', 1500],
      ],
    }],
    expectedQuery: 'SELECT DISTINCT category FROM products',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT' }],
    hints: [
      'DISTINCT category יציג כל קטגוריה פעם אחת',
      'SELECT DISTINCT category FROM products',
      'SELECT DISTINCT category FROM products',
    ],
    explanation: '6 מוצרים אבל רק 2 קטגוריות ייחודיות: אלקטרוניקה וריהוט.',
  },
  {
    id: 'level07-ex06',
    levelId: 7,
    title: 'סטטוסים ייחודיים',
    description: 'הצג את כל הסטטוסים השונים הקיימים בטבלת ההזמנות.',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  status TEXT,
  amount INTEGER
);
INSERT INTO orders VALUES
  (101, 'שולם', 1200),
  (102, 'ממתין', 450),
  (103, 'שולם', 3200),
  (104, 'בוטל', 750),
  (105, 'שולם', 980),
  (106, 'ממתין', 650);
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'status', 'amount'],
      rows: [
        [101, 'שולם', 1200],
        [102, 'ממתין', 450],
        [103, 'שולם', 3200],
        [104, 'בוטל', 750],
        [105, 'שולם', 980],
        [106, 'ממתין', 650],
      ],
    }],
    expectedQuery: 'SELECT DISTINCT status FROM orders',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT' }],
    hints: [
      'DISTINCT מציג כל ערך פעם אחת',
      'SELECT DISTINCT status FROM orders',
      'SELECT DISTINCT status FROM orders',
    ],
    explanation: '6 הזמנות עם 3 סטטוסים ייחודיים: שולם, ממתין, בוטל.',
  },
  {
    id: 'level07-ex07',
    levelId: 7,
    title: 'כמה ערים שונות?',
    description: 'כמה ערים שונות מופיעות בטבלת הלקוחות?',
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
    expectedQuery: 'SELECT COUNT(DISTINCT city) FROM customers',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT' }],
    hints: [
      'COUNT(DISTINCT עמודה) סופר ערכים ייחודיים',
      'COUNT(DISTINCT city)',
      'SELECT COUNT(DISTINCT city) FROM customers',
    ],
    explanation: '7 לקוחות, 4 ערים ייחודיות. COUNT(DISTINCT city) מחזיר 4.',
  },
  {
    id: 'level07-ex08',
    levelId: 7,
    title: 'DISTINCT שתי עמודות',
    description: 'הצג את כל השילובים הייחודיים של מחלקה ועיר שמופיעים בטבלת העובדים.',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  city TEXT
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 'תל אביב'),
  (2, 'יוסי', 'IT', 'חיפה'),
  (3, 'מיכל', 'מכירות', 'תל אביב'),
  (4, 'אבי', 'IT', 'תל אביב'),
  (5, 'רות', 'HR', 'ירושלים');
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'city'],
      rows: [
        [1, 'דנה', 'מכירות', 'תל אביב'],
        [2, 'יוסי', 'IT', 'חיפה'],
        [3, 'מיכל', 'מכירות', 'תל אביב'],
        [4, 'אבי', 'IT', 'תל אביב'],
        [5, 'רות', 'HR', 'ירושלים'],
      ],
    }],
    expectedQuery: 'SELECT DISTINCT department, city FROM employees',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT' }],
    hints: [
      'DISTINCT עם שתי עמודות מסיר כפילויות של השילוב שלהן',
      'SELECT DISTINCT department, city FROM employees',
      'SELECT DISTINCT department, city FROM employees',
    ],
    explanation: "DISTINCT עם שתי עמודות מסיר כפילויות של השילוב. 'מכירות + תל אביב' מופיע פעמיים (דנה ומיכל) — יוחזר פעם אחת.",
  },
]
