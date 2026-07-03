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

export const level03Exercises: Exercise[] = [
  {
    id: 'level03-ex01',
    levelId: 3,
    title: 'עובדי מחלקת IT',
    description: 'הצג את כל העובדים שעובדים במחלקת IT.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department = 'IT'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      'השתמש ב-WHERE לסינון לפי ערך מסוים',
      'הערכים של טקסט מוקפים בגרשיים: \'IT\'',
      "SELECT * FROM employees WHERE department = 'IT'",
    ],
    explanation: "WHERE department = 'IT' מסנן ומחזיר רק את השורות שבהן הערך בעמודת department הוא IT. שים לב לגרשיים סביב IT.",
  },
  {
    id: 'level03-ex02',
    levelId: 3,
    title: 'משכורת גבוהה',
    description: 'הצג את כל העובדים עם משכורת מעל 9,000 ₪.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees WHERE salary > 9000',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      'השתמש ב-> לבדיקה "גדול מ"',
      'WHERE salary > 9000 מחזיר עובדים עם משכורת מעל 9000',
      'SELECT * FROM employees WHERE salary > 9000',
    ],
    explanation: 'WHERE salary > 9000 מסנן ומחזיר רק עובדים שמשכורתם גדולה מ-9000. עובד עם משכורת 9000 לא יוחזר (כי צריך גדול ממש, לא שווה).',
  },
  {
    id: 'level03-ex03',
    levelId: 3,
    title: 'עובד לפי מזהה',
    description: 'הצג את פרטי העובד עם מספר עובד 3.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees WHERE employee_id = 3',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      'WHERE employee_id = 3',
      'מספרים לא צריכים גרשיים',
      'SELECT * FROM employees WHERE employee_id = 3',
    ],
    explanation: 'WHERE employee_id = 3 מחזיר את שורת העובד עם המזהה 3. שים לב: מספרים לא צריכים גרשיים, רק טקסט צריך.',
  },
  {
    id: 'level03-ex04',
    levelId: 3,
    title: 'לא מחלקת HR',
    description: 'הצג את כל העובדים שאינם במחלקת HR.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT * FROM employees WHERE department <> 'HR'",    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      'האופרטור "לא שווה" הוא <> או !=',
      "WHERE department <> 'HR'",
      "SELECT * FROM employees WHERE department <> 'HR'",
    ],
    explanation: "<> ו-!= שניהם אומרים \"לא שווה\". WHERE department <> 'HR' מחזיר את כל העובדים שהמחלקה שלהם אינה HR.",
  },
  {
    id: 'level03-ex05',
    levelId: 3,
    title: 'עובדים צעירים',
    description: 'הצג את כל העובדים שגילם קטן מ-30.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees WHERE age < 30',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      'האופרטור "קטן מ" הוא <',
      'WHERE age < 30',
      'SELECT * FROM employees WHERE age < 30',
    ],
    explanation: 'WHERE age < 30 מחזיר רק עובדים שגילם קטן בדיוק מ-30. עובד בן 30 לא יוחזר.',
  },
  {
    id: 'level03-ex06',
    levelId: 3,
    title: 'משכורת גבוהה עם עמודות נבחרות',
    description: 'הצג את שם הפרטי, מחלקה ומשכורת של עובדים עם משכורת של 9,000 ₪ לפחות.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, department, salary FROM employees WHERE salary >= 9000',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      '"לפחות" = גדול או שווה, אופרטור >=',
      'בחר שלוש עמודות ספציפיות',
      'SELECT first_name, department, salary FROM employees WHERE salary >= 9000',
    ],
    explanation: '>= אומר "גדול או שווה". עובד עם משכורת 9000 כן יוחזר (שווה). שים לב שגם בחרנו עמודות ספציפיות ולא *.',
  },
  {
    id: 'level03-ex07',
    levelId: 3,
    title: 'סינון לקוחות לפי עיר',
    description: 'הצג את כל הלקוחות מתל אביב.',
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
    expectedQuery: "SELECT * FROM customers WHERE city = 'תל אביב'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      'השתמש ב-WHERE עם גרשיים סביב הערך',
      "WHERE city = 'תל אביב'",
      "SELECT * FROM customers WHERE city = 'תל אביב'",
    ],
    explanation: "WHERE city = 'תל אביב' מחזיר רק לקוחות שהעיר שלהם היא תל אביב. ישנם 2 לקוחות כאלה.",
  },
  {
    id: 'level03-ex08',
    levelId: 3,
    title: 'הזמנות מעל סכום מסוים',
    description: 'הצג את כל ההזמנות ששולמו (status = \'שולם\').',
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
    expectedQuery: "SELECT * FROM orders WHERE status = 'שולם'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      "סינון לפי עמודת status עם הערך 'שולם'",
      "WHERE status = 'שולם'",
      "SELECT * FROM orders WHERE status = 'שולם'",
    ],
    explanation: "WHERE status = 'שולם' מחזיר רק הזמנות שסטטוסן הוא 'שולם'. 3 הזמנות עונות על התנאי.",
  },
  {
    id: 'level03-ex09',
    levelId: 3,
    title: 'מוצרים זולים',
    description: 'הצג את שם המוצר והמחיר של מוצרים שמחירם לא עולה על 500 ₪.',
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
    expectedQuery: 'SELECT product_name, price FROM products WHERE price <= 500',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      '"לא עולה על 500" = קטן או שווה, אופרטור <=',
      'בחר רק את עמודות product_name ו-price',
      'SELECT product_name, price FROM products WHERE price <= 500',
    ],
    explanation: '<= אומר "קטן או שווה". מוצר במחיר 500 כן יוחזר. 2 מוצרים עונים: עכבר (120) וכיסא (450).',
  },
  {
    id: 'level03-ex10',
    levelId: 3,
    title: 'סטודנטים מעל גיל 21',
    description: 'הצג את שם הסטודנט וגילו לכל מי שגילו גדול מ-21.',
    schema: `
CREATE TABLE students (
  student_id INTEGER PRIMARY KEY,
  first_name TEXT,
  age INTEGER,
  city TEXT,
  major TEXT
);
INSERT INTO students VALUES
  (1, 'אלון', 22, 'תל אביב', 'מדעי המחשב'),
  (2, 'שרה', 21, 'חיפה', 'פיזיקה'),
  (3, 'אורי', 23, 'ירושלים', 'מתמטיקה'),
  (4, 'נילי', 20, 'תל אביב', 'מדעי המחשב'),
  (5, 'ג׳ד', 24, 'באר שבע', 'כלכלה');
`,
    sampleData: [{
      tableName: 'students',
      columns: ['student_id', 'first_name', 'age', 'city', 'major'],
      rows: [
        [1, 'אלון', 22, 'תל אביב', 'מדעי המחשב'],
        [2, 'שרה', 21, 'חיפה', 'פיזיקה'],
        [3, 'אורי', 23, 'ירושלים', 'מתמטיקה'],
        [4, 'נילי', 20, 'תל אביב', 'מדעי המחשב'],
        [5, 'ג׳ד', 24, 'באר שבע', 'כלכלה'],
      ],
    }],
    expectedQuery: 'SELECT first_name, age FROM students WHERE age > 21',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE לסינון' }],
    hints: [
      'האופרטור "גדול מ" הוא >',
      'WHERE age > 21 — שרה (21) לא תוחזר',
      'SELECT first_name, age FROM students WHERE age > 21',
    ],
    explanation: 'WHERE age > 21 מחזיר סטודנטים עם גיל גדול בדיוק מ-21. שרה (21) לא תוחזר. אלון (22), אורי (23) וג\'ד (24) יוחזרו.',
  },
]
