import type { Exercise } from '../../types'

// Schema with clear FK relationships for JOIN practice
const joinSchema = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  city TEXT
);
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  amount INTEGER,
  status TEXT
);
INSERT INTO customers VALUES
  (1, 'עמית', 'שמיר', 'תל אביב'),
  (2, 'לילה', 'נוסייבה', 'חיפה'),
  (3, 'בן', 'ציון', 'ירושלים'),
  (4, 'נועה', 'הרץ', 'תל אביב'),
  (5, 'כרמל', 'אוחיון', 'באר שבע');
INSERT INTO orders VALUES
  (101, 1, '2024-01-15', 1200, 'שולם'),
  (102, 2, '2024-01-20', 450, 'ממתין'),
  (103, 1, '2024-02-01', 3200, 'שולם'),
  (104, 3, '2024-02-10', 750, 'בוטל'),
  (105, 6, '2024-03-05', 980, 'שולם');
`
// Note: order 105 has customer_id=6 which has no matching customer — for LEFT/RIGHT JOIN demos

const empDeptSchema = `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  dept_id INTEGER,
  salary INTEGER
);
CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name TEXT,
  manager_name TEXT
);
INSERT INTO departments VALUES
  (10, 'מכירות', 'יוסי כהן'),
  (20, 'IT', 'רחל לוי'),
  (30, 'שיווק', 'אבי ברק'),
  (40, 'HR', 'מיכל גל');
INSERT INTO employees VALUES
  (1, 'דנה', 10, 9000),
  (2, 'יוסי', 20, 12000),
  (3, 'מיכל', 30, 8500),
  (4, 'אבי', 10, 7500),
  (5, 'רות', 40, 10000),
  (6, 'תום', 20, 11000),
  (7, 'ענת', 99, 9500);
`
// Note: ענת has dept_id=99 which has no matching department — for LEFT JOIN demo

export const level13Exercises: Exercise[] = [
  // === INNER JOIN (ex 1-5) ===
  {
    id: 'level13-ex01',
    levelId: 13,
    title: 'INNER JOIN: לקוחות והזמנות',
    description: 'חבר את טבלת הלקוחות עם טבלת ההזמנות. הצג את שם הלקוח, מספר ההזמנה וסכום ההזמנה — רק לקוחות שיש להם הזמנה תואמת.',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: 'SELECT c.first_name, o.order_id, o.amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת שימוש ב-JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר תנאי החיבור עם ON' },
    ],
    hints: [
      'INNER JOIN מחזיר רק שורות עם התאמה בשתי הטבלאות',
      'ON c.customer_id = o.customer_id הוא תנאי החיבור',
      'SELECT c.first_name, o.order_id, o.amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id',
    ],
    explanation: 'INNER JOIN מחזיר רק שורות שיש להן התאמה בשתי הטבלאות. כרמל (customer_id=5) אין לה הזמנות — לא תוחזר. הזמנה 105 (customer_id=6) אין לה לקוח תואם — לא תוחזר.',
  },
  {
    id: 'level13-ex02',
    levelId: 13,
    title: 'INNER JOIN: עובדים ומחלקות',
    description: 'חבר עובדים עם המחלקות שלהם. הצג שם עובד ושם מחלקה — רק עובדים עם מחלקה תואמת.',
    schema: empDeptSchema,
    sampleData: [
      {
        tableName: 'employees',
        columns: ['employee_id', 'first_name', 'dept_id', 'salary'],
        rows: [
          [1, 'דנה', 10, 9000],
          [2, 'יוסי', 20, 12000],
          [3, 'מיכל', 30, 8500],
          [4, 'אבי', 10, 7500],
          [5, 'רות', 40, 10000],
          [6, 'תום', 20, 11000],
          [7, 'ענת', 99, 9500],
        ],
      },
      {
        tableName: 'departments',
        columns: ['dept_id', 'dept_name', 'manager_name'],
        rows: [
          [10, 'מכירות', 'יוסי כהן'],
          [20, 'IT', 'רחל לוי'],
          [30, 'שיווק', 'אבי ברק'],
          [40, 'HR', 'מיכל גל'],
        ],
      },
    ],
    expectedQuery: 'SELECT e.first_name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת שימוש ב-JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר תנאי החיבור עם ON' },
    ],
    hints: [
      'INNER JOIN employees עם departments',
      'ON e.dept_id = d.dept_id',
      'SELECT e.first_name, d.dept_name FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id',
    ],
    explanation: 'INNER JOIN: ענת (dept_id=99) אין מחלקה תואמת — לא תוחזר. 6 עובדים עם מחלקות יוחזרו.',
  },
  {
    id: 'level13-ex03',
    levelId: 13,
    title: 'INNER JOIN + WHERE',
    description: 'הצג שמות לקוחות וסכומי הזמנותיהם — רק הזמנות בסטטוס "שולם".',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: "SELECT c.first_name, o.amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = 'שולם'",
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת שימוש ב-JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר תנאי חיבור עם ON' },
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' },
    ],
    hints: [
      'JOIN ואחריו WHERE',
      "WHERE o.status = 'שולם'",
      "SELECT c.first_name, o.amount FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id WHERE o.status = 'שולם'",
    ],
    explanation: 'JOIN + WHERE: קודם JOIN מחבר את הטבלאות, אחר כך WHERE מסנן. רק הזמנות בסטטוס שולם יוחזרו.',
  },
  {
    id: 'level13-ex04',
    levelId: 13,
    title: 'INNER JOIN + GROUP BY',
    description: 'הצג כמה הזמנות ביצע כל לקוח (שם לקוח + מספר הזמנות).',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: 'SELECT c.first_name, COUNT(o.order_id) AS מספר_הזמנות FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
    ],
    hints: [
      'JOIN + GROUP BY',
      'GROUP BY c.customer_id, c.first_name',
      'SELECT c.first_name, COUNT(o.order_id) FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id',
    ],
    explanation: 'JOIN מחבר, GROUP BY מקבץ לפי לקוח, COUNT סופר הזמנות. עמית=2, לילה=1, בן=1.',
  },
  {
    id: 'level13-ex05',
    levelId: 13,
    title: 'INNER JOIN: שכר ומחלקה',
    description: 'הצג שם עובד, שם מחלקה ושכר — ממוין לפי שכר יורד.',
    schema: empDeptSchema,
    sampleData: [
      {
        tableName: 'employees',
        columns: ['employee_id', 'first_name', 'dept_id', 'salary'],
        rows: [
          [1, 'דנה', 10, 9000],
          [2, 'יוסי', 20, 12000],
          [3, 'מיכל', 30, 8500],
          [4, 'אבי', 10, 7500],
          [5, 'רות', 40, 10000],
          [6, 'תום', 20, 11000],
          [7, 'ענת', 99, 9500],
        ],
      },
      {
        tableName: 'departments',
        columns: ['dept_id', 'dept_name', 'manager_name'],
        rows: [
          [10, 'מכירות', 'יוסי כהן'],
          [20, 'IT', 'רחל לוי'],
          [30, 'שיווק', 'אבי ברק'],
          [40, 'HR', 'מיכל גל'],
        ],
      },
    ],
    expectedQuery: 'SELECT e.first_name, d.dept_name, e.salary FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id ORDER BY e.salary DESC',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת ORDER BY' },
    ],
    hints: [
      'INNER JOIN ואחריו ORDER BY e.salary DESC',
      'SELECT e.first_name, d.dept_name, e.salary',
      'SELECT e.first_name, d.dept_name, e.salary FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id ORDER BY e.salary DESC',
    ],
    explanation: 'INNER JOIN + ORDER BY: ענת (dept_id=99) לא תוחזר. 6 עובדים ממוינים לפי שכר יורד.',
  },
  // === LEFT JOIN (ex 6-9) ===
  {
    id: 'level13-ex06',
    levelId: 13,
    title: 'LEFT JOIN: כל הלקוחות',
    description: 'הצג את כל הלקוחות — גם אלה שאין להם הזמנות. ללקוחות ללא הזמנה הצג NULL בעמודת הסכום.',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: 'SELECT c.first_name, o.order_id, o.amount FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת שימוש ב-JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
    ],
    hints: [
      'LEFT JOIN מחזיר את כל שורות הטבלה הראשונה (שמאל)',
      'לקוחות ללא הזמנה יקבלו NULL בעמודות מטבלת orders',
      'SELECT c.first_name, o.order_id, o.amount FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id',
    ],
    explanation: 'LEFT JOIN: כל 5 הלקוחות יוחזרו. נועה וכרמל (אין הזמנות) יקבלו NULL ב-order_id וב-amount.',
  },
  {
    id: 'level13-ex07',
    levelId: 13,
    title: 'LEFT JOIN: מצא לקוחות ללא הזמנות',
    description: 'הצג רק לקוחות שלא ביצעו אף הזמנה.',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: 'SELECT c.first_name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
      { type: 'requiresKeyword', keyword: 'IS NULL', message: 'לזיהוי לקוחות ללא הזמנה יש לבדוק IS NULL' },
    ],
    hints: [
      'LEFT JOIN ואחריו WHERE o.order_id IS NULL',
      'לקוחות ללא הזמנה יקבלו NULL — בדוק עם IS NULL',
      'SELECT c.first_name FROM customers c LEFT JOIN orders o ON c.customer_id = o.customer_id WHERE o.order_id IS NULL',
    ],
    explanation: 'LEFT JOIN + IS NULL: לקוחות שאין להם הזמנה תואמת יקבלו NULL בעמודות orders. סינון ב-WHERE o.order_id IS NULL מוצא אותם.',
  },
  {
    id: 'level13-ex08',
    levelId: 13,
    title: 'LEFT JOIN: כל העובדים עם מחלקותיהם',
    description: 'הצג את כל העובדים עם שם המחלקה שלהם. לעובד שאין לו מחלקה תואמת הצג NULL.',
    schema: empDeptSchema,
    sampleData: [
      {
        tableName: 'employees',
        columns: ['employee_id', 'first_name', 'dept_id', 'salary'],
        rows: [
          [1, 'דנה', 10, 9000],
          [2, 'יוסי', 20, 12000],
          [3, 'מיכל', 30, 8500],
          [4, 'אבי', 10, 7500],
          [5, 'רות', 40, 10000],
          [6, 'תום', 20, 11000],
          [7, 'ענת', 99, 9500],
        ],
      },
      {
        tableName: 'departments',
        columns: ['dept_id', 'dept_name', 'manager_name'],
        rows: [
          [10, 'מכירות', 'יוסי כהן'],
          [20, 'IT', 'רחל לוי'],
          [30, 'שיווק', 'אבי ברק'],
          [40, 'HR', 'מיכל גל'],
        ],
      },
    ],
    expectedQuery: 'SELECT e.first_name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
    ],
    hints: [
      'LEFT JOIN כדי לשמור על כל העובדים',
      'ענת (dept_id=99) תקבל NULL בעמודת dept_name',
      'SELECT e.first_name, d.dept_name FROM employees e LEFT JOIN departments d ON e.dept_id = d.dept_id',
    ],
    explanation: 'LEFT JOIN: כל 7 העובדים יוחזרו. ענת (dept_id=99) תקבל NULL ב-dept_name.',
  },
  {
    id: 'level13-ex09',
    levelId: 13,
    title: 'RIGHT JOIN: כל ההזמנות',
    description: 'הצג את כל ההזמנות — גם הזמנות ללא לקוח תואם. הצג שם לקוח או NULL.',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: 'SELECT c.first_name, o.order_id, o.amount FROM customers c RIGHT JOIN orders o ON c.customer_id = o.customer_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
    ],
    hints: [
      'RIGHT JOIN שומר על כל שורות הטבלה הימנית (orders)',
      'הזמנה 105 אין לה לקוח תואם — first_name יהיה NULL',
      'SELECT c.first_name, o.order_id, o.amount FROM customers c RIGHT JOIN orders o ON c.customer_id = o.customer_id',
    ],
    explanation: 'RIGHT JOIN: כל 5 ההזמנות יוחזרו. הזמנה 105 (customer_id=6, לא קיים בלקוחות) תקבל NULL ב-first_name.',
  },
  {
    id: 'level13-ex10',
    levelId: 13,
    title: 'RIGHT JOIN: מחלקות ללא עובדים',
    description: 'הצג את כל המחלקות עם העובדים — כולל מחלקות ריקות. (employees RIGHT JOIN departments)',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  dept_id INTEGER
);
CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name TEXT
);
INSERT INTO departments VALUES
  (10, 'מכירות'),
  (20, 'IT'),
  (30, 'שיווק'),
  (40, 'HR'),
  (50, 'כספים');
INSERT INTO employees VALUES
  (1, 'דנה', 10),
  (2, 'יוסי', 20),
  (3, 'מיכל', 30),
  (4, 'אבי', 10),
  (5, 'רות', 40);
`,
    sampleData: [
      {
        tableName: 'employees',
        columns: ['employee_id', 'first_name', 'dept_id'],
        rows: [
          [1, 'דנה', 10],
          [2, 'יוסי', 20],
          [3, 'מיכל', 30],
          [4, 'אבי', 10],
          [5, 'רות', 40],
        ],
      },
      {
        tableName: 'departments',
        columns: ['dept_id', 'dept_name'],
        rows: [
          [10, 'מכירות'],
          [20, 'IT'],
          [30, 'שיווק'],
          [40, 'HR'],
          [50, 'כספים'],
        ],
      },
    ],
    expectedQuery: 'SELECT e.first_name, d.dept_name FROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
    ],
    hints: [
      'RIGHT JOIN שומר את כל שורות הטבלה הימנית (departments)',
      'מחלקת כספים (50) אין לה עובדים — first_name יהיה NULL',
      'SELECT e.first_name, d.dept_name FROM employees e RIGHT JOIN departments d ON e.dept_id = d.dept_id',
    ],
    explanation: 'RIGHT JOIN: כל 5 המחלקות יוחזרו. כספים (50) אין לה עובדים — first_name=NULL.',
  },
  {
    id: 'level13-ex11',
    levelId: 13,
    title: 'LEFT vs RIGHT: הבדל',
    description: 'שאלת הבנה: הצג את כל המחלקות עם עובדיהן, כולל מחלקות ריקות — הפעם השתמש ב-LEFT JOIN (הפוך את סדר הטבלאות).',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  dept_id INTEGER
);
CREATE TABLE departments (
  dept_id INTEGER PRIMARY KEY,
  dept_name TEXT
);
INSERT INTO departments VALUES
  (10, 'מכירות'),
  (20, 'IT'),
  (30, 'שיווק'),
  (40, 'HR'),
  (50, 'כספים');
INSERT INTO employees VALUES
  (1, 'דנה', 10),
  (2, 'יוסי', 20),
  (3, 'מיכל', 30),
  (4, 'אבי', 10),
  (5, 'רות', 40);
`,
    sampleData: [
      {
        tableName: 'departments',
        columns: ['dept_id', 'dept_name'],
        rows: [
          [10, 'מכירות'],
          [20, 'IT'],
          [30, 'שיווק'],
          [40, 'HR'],
          [50, 'כספים'],
        ],
      },
      {
        tableName: 'employees',
        columns: ['employee_id', 'first_name', 'dept_id'],
        rows: [
          [1, 'דנה', 10],
          [2, 'יוסי', 20],
          [3, 'מיכל', 30],
          [4, 'אבי', 10],
          [5, 'רות', 40],
        ],
      },
    ],
    expectedQuery: 'SELECT e.first_name, d.dept_name FROM departments d LEFT JOIN employees e ON d.dept_id = e.dept_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
    ],
    hints: [
      'הפוך את סדר הטבלאות: departments LEFT JOIN employees',
      'departments היא הטבלה הראשונה — כל המחלקות יישמרו',
      'SELECT e.first_name, d.dept_name FROM departments d LEFT JOIN employees e ON d.dept_id = e.dept_id',
    ],
    explanation: 'LEFT JOIN עם הפיכת סדר טבלאות = RIGHT JOIN רגיל. departments LEFT JOIN employees: כל המחלקות נשמרות כולל כספים.',
  },
  {
    id: 'level13-ex12',
    levelId: 13,
    title: 'FULL OUTER JOIN',
    description: 'הצג את כל הלקוחות וכל ההזמנות — גם לקוחות ללא הזמנות וגם הזמנות ללא לקוח תואם.',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: 'SELECT c.first_name, o.order_id, o.amount FROM customers c FULL OUTER JOIN orders o ON c.customer_id = o.customer_id',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
    ],
    hints: [
      'FULL OUTER JOIN מחזיר הכל — משתי הטבלאות',
      'לקוחות ללא הזמנות: NULL בעמודות orders. הזמנות ללא לקוח: NULL בעמודות customers',
      'SELECT c.first_name, o.order_id, o.amount FROM customers c FULL OUTER JOIN orders o ON c.customer_id = o.customer_id',
    ],
    explanation: 'FULL OUTER JOIN מחזיר את כל השורות משתי הטבלאות. היכן אין התאמה — NULL. הכי מקיף מבין סוגי ה-JOIN.',
  },
  {
    id: 'level13-ex13',
    levelId: 13,
    title: 'JOIN + GROUP BY + HAVING',
    description: 'הצג לקוחות שסכום הזמנותיהם עולה על 1,500 ₪.',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: 'SELECT c.first_name, SUM(o.amount) AS סה"כ FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id, c.first_name HAVING SUM(o.amount) > 1500',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'JOIN + GROUP BY c.customer_id + HAVING SUM',
      'HAVING SUM(o.amount) > 1500',
      'SELECT c.first_name, SUM(o.amount) FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id GROUP BY c.customer_id HAVING SUM(o.amount) > 1500',
    ],
    explanation: 'JOIN מחבר, GROUP BY מקבץ לפי לקוח, SUM מחשב, HAVING מסנן. עמית: 1200+3200=4400 ✓. לילה: 450 ✗. בן: 750 ✗.',
  },
  {
    id: 'level13-ex14',
    levelId: 13,
    title: 'JOIN עם שם מחלקה ושכר ממוצע',
    description: 'הצג שם מחלקה וממוצע שכר עובדיה — רק מחלקות עם ממוצע שכר מעל 9,000.',
    schema: empDeptSchema,
    sampleData: [
      {
        tableName: 'employees',
        columns: ['employee_id', 'first_name', 'dept_id', 'salary'],
        rows: [
          [1, 'דנה', 10, 9000],
          [2, 'יוסי', 20, 12000],
          [3, 'מיכל', 30, 8500],
          [4, 'אבי', 10, 7500],
          [5, 'רות', 40, 10000],
          [6, 'תום', 20, 11000],
          [7, 'ענת', 99, 9500],
        ],
      },
      {
        tableName: 'departments',
        columns: ['dept_id', 'dept_name', 'manager_name'],
        rows: [
          [10, 'מכירות', 'יוסי כהן'],
          [20, 'IT', 'רחל לוי'],
          [30, 'שיווק', 'אבי ברק'],
          [40, 'HR', 'מיכל גל'],
        ],
      },
    ],
    expectedQuery: 'SELECT d.dept_name, AVG(e.salary) AS ממוצע_שכר FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id GROUP BY d.dept_id, d.dept_name HAVING AVG(e.salary) > 9000',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'HAVING', message: 'המשימה מחייבת HAVING' },
    ],
    hints: [
      'JOIN עובדים עם מחלקות, GROUP BY מחלקה',
      'HAVING AVG(e.salary) > 9000',
      'SELECT d.dept_name, AVG(e.salary) FROM employees e INNER JOIN departments d ON e.dept_id = d.dept_id GROUP BY d.dept_name HAVING AVG(e.salary) > 9000',
    ],
    explanation: 'IT: (12000+11000)/2=11500 ✓. HR: 10000 ✓. מכירות: (9000+7500)/2=8250 ✗. שיווק: 8500 ✗.',
  },
  {
    id: 'level13-ex15',
    levelId: 13,
    title: 'שאלת אינטגרציה: JOIN מלא',
    description: 'הצג לקוחות מתל אביב עם מספר ההזמנות שלהם — ממוין מהרב לפחות.',
    schema: joinSchema,
    sampleData: [
      {
        tableName: 'customers',
        columns: ['customer_id', 'first_name', 'last_name', 'city'],
        rows: [
          [1, 'עמית', 'שמיר', 'תל אביב'],
          [2, 'לילה', 'נוסייבה', 'חיפה'],
          [3, 'בן', 'ציון', 'ירושלים'],
          [4, 'נועה', 'הרץ', 'תל אביב'],
          [5, 'כרמל', 'אוחיון', 'באר שבע'],
        ],
      },
      {
        tableName: 'orders',
        columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
        rows: [
          [101, 1, '2024-01-15', 1200, 'שולם'],
          [102, 2, '2024-01-20', 450, 'ממתין'],
          [103, 1, '2024-02-01', 3200, 'שולם'],
          [104, 3, '2024-02-10', 750, 'בוטל'],
          [105, 6, '2024-03-05', 980, 'שולם'],
        ],
      },
    ],
    expectedQuery: "SELECT c.first_name, COUNT(o.order_id) AS מספר_הזמנות FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id WHERE c.city = 'תל אביב' GROUP BY c.customer_id, c.first_name ORDER BY COUNT(o.order_id) DESC",
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'JOIN', message: 'המשימה מחייבת JOIN' },
      { type: 'requiresKeyword', keyword: 'ON', message: 'יש להגדיר ON' },
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת WHERE' },
      { type: 'requiresKeyword', keyword: 'GROUP BY', message: 'המשימה מחייבת GROUP BY' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת ORDER BY' },
    ],
    hints: [
      "WHERE c.city = 'תל אביב' לאחר JOIN",
      'GROUP BY c.customer_id, c.first_name',
      "SELECT c.first_name, COUNT(o.order_id) FROM customers c INNER JOIN orders o ON c.customer_id = o.customer_id WHERE c.city = 'תל אביב' GROUP BY c.customer_id ORDER BY COUNT(o.order_id) DESC",
    ],
    explanation: 'שאילתה מלאה: JOIN + WHERE + GROUP BY + ORDER BY. רק לקוחות תל אביב שיש להם הזמנות. עמית (2 הזמנות) > נועה (0 — לא תוחזר ב-INNER JOIN).',
  },
]
