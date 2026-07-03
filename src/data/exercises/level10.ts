import type { Exercise } from '../../types'

export const level10Exercises: Exercise[] = [
  {
    id: 'level10-ex01',
    levelId: 10,
    title: 'עובדים ללא אימייל',
    description: 'הצג עובדים שאין להם כתובת אימייל (הערך NULL).',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER,
  email TEXT
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000, 'dana@co.com'),
  (2, 'יוסי', 'IT', 12000, NULL),
  (3, 'מיכל', 'שיווק', 8500, 'michal@co.com'),
  (4, 'אבי', 'מכירות', 7500, NULL),
  (5, 'רות', 'HR', 10000, 'ruth@co.com');
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'salary', 'email'],
      rows: [
        [1, 'דנה', 'מכירות', 9000, 'dana@co.com'],
        [2, 'יוסי', 'IT', 12000, null],
        [3, 'מיכל', 'שיווק', 8500, 'michal@co.com'],
        [4, 'אבי', 'מכירות', 7500, null],
        [5, 'רות', 'HR', 10000, 'ruth@co.com'],
      ],
    }],
    expectedQuery: 'SELECT * FROM employees WHERE email IS NULL',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'IS NULL', message: 'לבדיקת NULL יש להשתמש ב-IS NULL ולא ב-= NULL' },
      { type: 'forbidsPattern', pattern: '=\\s*NULL', message: 'לא ניתן להשוות ל-NULL עם =. השתמש ב-IS NULL' },
    ],
    hints: [
      'NULL לא ניתן להשוות עם = — צריך IS NULL',
      'WHERE email IS NULL',
      'SELECT * FROM employees WHERE email IS NULL',
    ],
    explanation: 'NULL מייצג ערך חסר. לא ניתן להשוות NULL עם = או !=. חייבים להשתמש ב-IS NULL.',
  },
  {
    id: 'level10-ex02',
    levelId: 10,
    title: 'עובדים עם אימייל',
    description: 'הצג עובדים שיש להם כתובת אימייל (הערך אינו NULL).',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER,
  email TEXT
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000, 'dana@co.com'),
  (2, 'יוסי', 'IT', 12000, NULL),
  (3, 'מיכל', 'שיווק', 8500, 'michal@co.com'),
  (4, 'אבי', 'מכירות', 7500, NULL),
  (5, 'רות', 'HR', 10000, 'ruth@co.com');
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'salary', 'email'],
      rows: [
        [1, 'דנה', 'מכירות', 9000, 'dana@co.com'],
        [2, 'יוסי', 'IT', 12000, null],
        [3, 'מיכל', 'שיווק', 8500, 'michal@co.com'],
        [4, 'אבי', 'מכירות', 7500, null],
        [5, 'רות', 'HR', 10000, 'ruth@co.com'],
      ],
    }],
    expectedQuery: 'SELECT * FROM employees WHERE email IS NOT NULL',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'IS NOT NULL', message: 'לבדיקת ערך קיים יש להשתמש ב-IS NOT NULL' },
    ],
    hints: [
      'IS NOT NULL בודק שהערך אינו חסר',
      'WHERE email IS NOT NULL',
      'SELECT * FROM employees WHERE email IS NOT NULL',
    ],
    explanation: 'IS NOT NULL מחזיר שורות שבהן הערך אינו NULL. 3 עובדים עם אימייל.',
  },
  {
    id: 'level10-ex03',
    levelId: 10,
    title: 'שליפה לפי שנה',
    description: 'הצג משלוחים שנשלחו בשנת 2024.',
    schema: `
CREATE TABLE shipments (
  shipment_id INTEGER PRIMARY KEY,
  status TEXT,
  delivery_date TEXT,
  cost INTEGER
);
INSERT INTO shipments VALUES
  (1001, 'נמסר', '2023-05-10', 120),
  (1002, 'מאוחר', '2024-03-14', 200),
  (1003, 'נמסר', '2024-07-22', 150),
  (1004, 'מאוחר', '2023-09-30', 180),
  (1005, 'נמסר', '2024-11-05', 90);
`,
    sampleData: [{
      tableName: 'shipments',
      columns: ['shipment_id', 'status', 'delivery_date', 'cost'],
      rows: [
        [1001, 'נמסר', '2023-05-10', 120],
        [1002, 'מאוחר', '2024-03-14', 200],
        [1003, 'נמסר', '2024-07-22', 150],
        [1004, 'מאוחר', '2023-09-30', 180],
        [1005, 'נמסר', '2024-11-05', 90],
      ],
    }],
    expectedQuery: 'SELECT * FROM shipments WHERE YEAR(delivery_date) = 2024',
    requiredConcepts: [],
    hints: [
      'YEAR() חולצת את השנה מתאריך',
      'WHERE YEAR(delivery_date) = 2024',
      'SELECT * FROM shipments WHERE YEAR(delivery_date) = 2024',
    ],
    explanation: 'YEAR(delivery_date) חולצת את השנה מהתאריך. 3 משלוחים מ-2024: 1002, 1003, 1005.',
  },
  {
    id: 'level10-ex04',
    levelId: 10,
    title: 'שליפה לפי חודש',
    description: 'הצג הזמנות שנעשו בחודש ינואר (חודש 1).',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  order_date TEXT,
  amount INTEGER,
  status TEXT
);
INSERT INTO orders VALUES
  (101, '2024-01-15', 1200, 'שולם'),
  (102, '2024-01-20', 450, 'ממתין'),
  (103, '2024-02-01', 3200, 'שולם'),
  (104, '2024-02-10', 750, 'בוטל'),
  (105, '2024-03-05', 980, 'שולם');
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'order_date', 'amount', 'status'],
      rows: [
        [101, '2024-01-15', 1200, 'שולם'],
        [102, '2024-01-20', 450, 'ממתין'],
        [103, '2024-02-01', 3200, 'שולם'],
        [104, '2024-02-10', 750, 'בוטל'],
        [105, '2024-03-05', 980, 'שולם'],
      ],
    }],
    expectedQuery: 'SELECT * FROM orders WHERE MONTH(order_date) = 1',
    requiredConcepts: [],
    hints: [
      'MONTH() חולצת את החודש מתאריך',
      'WHERE MONTH(order_date) = 1',
      'SELECT * FROM orders WHERE MONTH(order_date) = 1',
    ],
    explanation: 'MONTH(order_date) = 1 מחזירה הזמנות מינואר. 2 הזמנות: 101 ו-102.',
  },
  {
    id: 'level10-ex05',
    levelId: 10,
    title: 'NULL עם AND',
    description: 'הצג עובדים שאין להם אימייל וגם עובדים במכירות.',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER,
  email TEXT
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000, 'dana@co.com'),
  (2, 'יוסי', 'IT', 12000, NULL),
  (3, 'מיכל', 'שיווק', 8500, NULL),
  (4, 'אבי', 'מכירות', 7500, NULL),
  (5, 'רות', 'HR', 10000, 'ruth@co.com');
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'salary', 'email'],
      rows: [
        [1, 'דנה', 'מכירות', 9000, 'dana@co.com'],
        [2, 'יוסי', 'IT', 12000, null],
        [3, 'מיכל', 'שיווק', 8500, null],
        [4, 'אבי', 'מכירות', 7500, null],
        [5, 'רות', 'HR', 10000, 'ruth@co.com'],
      ],
    }],
    expectedQuery: "SELECT * FROM employees WHERE email IS NULL AND department = 'מכירות'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'IS NULL', message: 'לבדיקת NULL יש להשתמש ב-IS NULL' }],
    hints: [
      'IS NULL AND department = ...',
      "WHERE email IS NULL AND department = 'מכירות'",
      "SELECT * FROM employees WHERE email IS NULL AND department = 'מכירות'",
    ],
    explanation: "IS NULL עם AND: אבי (מכירות, NULL) ✓. יוסי (IT, NULL) ✗ — לא מכירות.",
  },
  {
    id: 'level10-ex06',
    levelId: 10,
    title: 'משלוחים מאוחרים בשנה ספציפית',
    description: 'הצג משלוחים שסטטוסם "מאוחר" ושנת המשלוח היא 2024.',
    schema: `
CREATE TABLE shipments (
  shipment_id INTEGER PRIMARY KEY,
  status TEXT,
  delivery_date TEXT,
  cost INTEGER
);
INSERT INTO shipments VALUES
  (1001, 'נמסר', '2023-05-10', 120),
  (1002, 'מאוחר', '2024-03-14', 200),
  (1003, 'נמסר', '2024-07-22', 150),
  (1004, 'מאוחר', '2023-09-30', 180),
  (1005, 'מאוחר', '2024-11-05', 90);
`,
    sampleData: [{
      tableName: 'shipments',
      columns: ['shipment_id', 'status', 'delivery_date', 'cost'],
      rows: [
        [1001, 'נמסר', '2023-05-10', 120],
        [1002, 'מאוחר', '2024-03-14', 200],
        [1003, 'נמסר', '2024-07-22', 150],
        [1004, 'מאוחר', '2023-09-30', 180],
        [1005, 'מאוחר', '2024-11-05', 90],
      ],
    }],
    expectedQuery: "SELECT * FROM shipments WHERE status = 'מאוחר' AND YEAR(delivery_date) = 2024",
    requiredConcepts: [],
    hints: [
      "WHERE status = 'מאוחר' AND YEAR(delivery_date) = 2024",
      "שלב סינון טקסט עם פונקציית תאריך",
      "SELECT * FROM shipments WHERE status = 'מאוחר' AND YEAR(delivery_date) = 2024",
    ],
    explanation: "שילוב תנאי: status='מאוחר' AND שנה=2024. משלוח 1002 ✓ (מאוחר, 2024). משלוח 1004 ✗ (מאוחר, 2023).",
  },
  {
    id: 'level10-ex07',
    levelId: 10,
    title: 'שליחה לפי יום',
    description: 'הצג הזמנות שנעשו ביום ה-15 לחודש.',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  order_date TEXT,
  amount INTEGER
);
INSERT INTO orders VALUES
  (101, '2024-01-15', 1200),
  (102, '2024-01-20', 450),
  (103, '2024-02-15', 3200),
  (104, '2024-02-10', 750),
  (105, '2024-03-15', 980);
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'order_date', 'amount'],
      rows: [
        [101, '2024-01-15', 1200],
        [102, '2024-01-20', 450],
        [103, '2024-02-15', 3200],
        [104, '2024-02-10', 750],
        [105, '2024-03-15', 980],
      ],
    }],
    expectedQuery: 'SELECT * FROM orders WHERE DAY(order_date) = 15',
    requiredConcepts: [],
    hints: [
      'DAY() חולצת את היום מתאריך',
      'WHERE DAY(order_date) = 15',
      'SELECT * FROM orders WHERE DAY(order_date) = 15',
    ],
    explanation: 'DAY(order_date) = 15: הזמנות 101, 103, 105 נעשו ביום ה-15. 3 הזמנות יוחזרו.',
  },
  {
    id: 'level10-ex08',
    levelId: 10,
    title: 'ספירת NULL',
    description: 'כמה עובדים אין להם כתובת אימייל?',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  department TEXT,
  salary INTEGER,
  email TEXT
);
INSERT INTO employees VALUES
  (1, 'דנה', 'מכירות', 9000, 'dana@co.com'),
  (2, 'יוסי', 'IT', 12000, NULL),
  (3, 'מיכל', 'שיווק', 8500, 'michal@co.com'),
  (4, 'אבי', 'מכירות', 7500, NULL),
  (5, 'רות', 'HR', 10000, NULL);
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'department', 'salary', 'email'],
      rows: [
        [1, 'דנה', 'מכירות', 9000, 'dana@co.com'],
        [2, 'יוסי', 'IT', 12000, null],
        [3, 'מיכל', 'שיווק', 8500, 'michal@co.com'],
        [4, 'אבי', 'מכירות', 7500, null],
        [5, 'רות', 'HR', 10000, null],
      ],
    }],
    expectedQuery: 'SELECT COUNT(*) AS ללא_אימייל FROM employees WHERE email IS NULL',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'IS NULL', message: 'לבדיקת NULL יש להשתמש ב-IS NULL' }],
    hints: [
      'שלב COUNT(*) עם WHERE email IS NULL',
      'COUNT(*) AS ללא_אימייל',
      'SELECT COUNT(*) AS ללא_אימייל FROM employees WHERE email IS NULL',
    ],
    explanation: 'COUNT(*) עם IS NULL: 3 עובדים ללא אימייל (יוסי, אבי, רות).',
  },
]
