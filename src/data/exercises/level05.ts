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

export const level05Exercises: Exercise[] = [
  {
    id: 'level05-ex01',
    levelId: 5,
    title: 'טווח גילאים עם BETWEEN',
    description: 'הצג עובדים שגילם בין 28 ל-35 (כולל).',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees WHERE age BETWEEN 28 AND 35',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'BETWEEN', message: 'המשימה מחייבת שימוש ב-BETWEEN' }],
    hints: [
      'BETWEEN בודק אם ערך בטווח כולל שני הקצוות',
      'WHERE age BETWEEN 28 AND 35',
      'SELECT * FROM employees WHERE age BETWEEN 28 AND 35',
    ],
    explanation: 'BETWEEN 28 AND 35 בודק אם הגיל בטווח 28 עד 35 כולל. זה שקול ל-age >= 28 AND age <= 35.',
  },
  {
    id: 'level05-ex02',
    levelId: 5,
    title: 'טווח משכורות',
    description: 'הצג עובדים עם משכורת בין 8,500 ל-10,000 ₪.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, salary FROM employees WHERE salary BETWEEN 8500 AND 10000',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'BETWEEN', message: 'המשימה מחייבת שימוש ב-BETWEEN' }],
    hints: [
      'BETWEEN כולל את שני הקצוות',
      'WHERE salary BETWEEN 8500 AND 10000',
      'SELECT first_name, salary FROM employees WHERE salary BETWEEN 8500 AND 10000',
    ],
    explanation: 'BETWEEN 8500 AND 10000 כולל גם עובד עם משכורת 8500 וגם 10000.',
  },
  {
    id: 'level05-ex03',
    levelId: 5,
    title: 'IN עם מחלקות',
    description: 'הצג עובדים שעובדים ב-IT, HR, או שיווק.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department IN ('IT', 'HR', 'שיווק')",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'IN', message: 'המשימה מחייבת שימוש ב-IN' }],
    hints: [
      'IN בודק אם ערך נמצא ברשימה',
      "WHERE department IN ('IT', 'HR', 'שיווק')",
      "SELECT * FROM employees WHERE department IN ('IT', 'HR', 'שיווק')",
    ],
    explanation: "IN ('IT', 'HR', 'שיווק') בודק אם המחלקה היא אחד מהערכים ברשימה. זה קיצור ל-3 תנאי OR.",
  },
  {
    id: 'level05-ex04',
    levelId: 5,
    title: 'NOT IN',
    description: 'הצג עובדים שאינם ב-IT ואינם בשיווק.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department NOT IN ('IT', 'שיווק')",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'IN', message: 'המשימה מחייבת שימוש ב-IN' }],
    hints: [
      'NOT IN הוא ההיפך של IN',
      "WHERE department NOT IN ('IT', 'שיווק')",
      "SELECT * FROM employees WHERE department NOT IN ('IT', 'שיווק')",
    ],
    explanation: "NOT IN מוציא מהתוצאות את הערכים הנמצאים ברשימה. דנה (מכירות), אבי (מכירות), רות (HR) יוחזרו.",
  },
  {
    id: 'level05-ex05',
    levelId: 5,
    title: 'BETWEEN על מחירים',
    description: 'הצג מוצרים שמחירם בין 400 ל-2500 ₪.',
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
    expectedQuery: 'SELECT product_name, price FROM products WHERE price BETWEEN 400 AND 2500',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'BETWEEN', message: 'המשימה מחייבת שימוש ב-BETWEEN' }],
    hints: [
      'BETWEEN 400 AND 2500',
      'WHERE price BETWEEN 400 AND 2500',
      'SELECT product_name, price FROM products WHERE price BETWEEN 400 AND 2500',
    ],
    explanation: 'BETWEEN 400 AND 2500: כיסא (450) ✓, שולחן (800) ✓, טלפון (2200) ✓. עכבר (120) ✗, מחשב (3500) ✗.',
  },
  {
    id: 'level05-ex06',
    levelId: 5,
    title: 'IN עם ערים',
    description: 'הצג לקוחות שגרים בתל אביב, חיפה, או ירושלים.',
    schema: `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  city TEXT,
  email TEXT
);
INSERT INTO customers VALUES
  (1, 'עמית', 'שמיר', 'תל אביב', 'amit@mail.com'),
  (2, 'לילה', 'נוסייבה', 'חיפה', 'laila@mail.com'),
  (3, 'בן', 'ציון', 'ירושלים', 'ben@mail.com'),
  (4, 'נועה', 'הרץ', 'תל אביב', 'noa@mail.com'),
  (5, 'כרמל', 'אוחיון', 'באר שבע', 'carmel@mail.com');
`,
    sampleData: [{
      tableName: 'customers',
      columns: ['customer_id', 'first_name', 'last_name', 'city', 'email'],
      rows: [
        [1, 'עמית', 'שמיר', 'תל אביב', 'amit@mail.com'],
        [2, 'לילה', 'נוסייבה', 'חיפה', 'laila@mail.com'],
        [3, 'בן', 'ציון', 'ירושלים', 'ben@mail.com'],
        [4, 'נועה', 'הרץ', 'תל אביב', 'noa@mail.com'],
        [5, 'כרמל', 'אוחיון', 'באר שבע', 'carmel@mail.com'],
      ],
    }],
    expectedQuery: "SELECT * FROM customers WHERE city IN ('תל אביב', 'חיפה', 'ירושלים')",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'IN', message: 'המשימה מחייבת שימוש ב-IN' }],
    hints: [
      "IN ('תל אביב', 'חיפה', 'ירושלים')",
      'WHERE city IN (...)',
      "SELECT * FROM customers WHERE city IN ('תל אביב', 'חיפה', 'ירושלים')",
    ],
    explanation: "IN עם 3 ערים שקול ל-OR עם 3 תנאים אבל קצר יותר. 4 מתוך 5 לקוחות יוחזרו.",
  },
  {
    id: 'level05-ex07',
    levelId: 5,
    title: 'BETWEEN על תאריכים',
    description: 'הצג הזמנות שתאריכן בין 2024-01-01 ל-2024-02-28.',
    schema: `
CREATE TABLE orders (
  order_id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  order_date TEXT,
  amount INTEGER,
  status TEXT
);
INSERT INTO orders VALUES
  (101, 1, '2024-01-15', 1200, 'שולם'),
  (102, 2, '2024-01-20', 450, 'ממתין'),
  (103, 1, '2024-02-01', 3200, 'שולם'),
  (104, 3, '2024-02-10', 750, 'בוטל'),
  (105, 4, '2024-03-05', 980, 'שולם');
`,
    sampleData: [{
      tableName: 'orders',
      columns: ['order_id', 'customer_id', 'order_date', 'amount', 'status'],
      rows: [
        [101, 1, '2024-01-15', 1200, 'שולם'],
        [102, 2, '2024-01-20', 450, 'ממתין'],
        [103, 1, '2024-02-01', 3200, 'שולם'],
        [104, 3, '2024-02-10', 750, 'בוטל'],
        [105, 4, '2024-03-05', 980, 'שולם'],
      ],
    }],
    expectedQuery: "SELECT * FROM orders WHERE order_date BETWEEN '2024-01-01' AND '2024-02-28'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'BETWEEN', message: 'המשימה מחייבת שימוש ב-BETWEEN' }],
    hints: [
      'BETWEEN עובד גם על תאריכים (כמחרוזות)',
      "WHERE order_date BETWEEN '2024-01-01' AND '2024-02-28'",
      "SELECT * FROM orders WHERE order_date BETWEEN '2024-01-01' AND '2024-02-28'",
    ],
    explanation: "BETWEEN עובד על תאריכים כאשר הם מפורמטים בצורה עקבית (YYYY-MM-DD). 4 הזמנות ינות בטווח, מרץ לא.",
  },
  {
    id: 'level05-ex08',
    levelId: 5,
    title: 'BETWEEN ו-IN ביחד',
    description: 'הצג עובדים שמחלקתם IT או שיווק, וגם גילם בין 28 ל-35.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department IN ('IT', 'שיווק') AND age BETWEEN 28 AND 35",
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'IN', message: 'המשימה מחייבת שימוש ב-IN' },
      { type: 'requiresKeyword', keyword: 'BETWEEN', message: 'המשימה מחייבת שימוש ב-BETWEEN' },
    ],
    hints: [
      "IN ('IT', 'שיווק') AND age BETWEEN 28 AND 35",
      "WHERE department IN ('IT', 'שיווק') AND age BETWEEN 28 AND 35",
      "SELECT * FROM employees WHERE department IN ('IT', 'שיווק') AND age BETWEEN 28 AND 35",
    ],
    explanation: "שילוב IN ו-BETWEEN: יוסי (IT, 35) ✓. תום (IT, 29) ✓. מיכל (שיווק, 31) ✓. ענת (שיווק, 38) ✗ — 38 > 35.",
  },
]
