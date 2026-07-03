import type { Exercise } from '../../types'

const schema = `
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
  (5, 'רות', 'גלעד', 'HR', 10000, 42);
`

const sampleData = [{
  tableName: 'employees',
  columns: ['employee_id', 'first_name', 'last_name', 'department', 'salary', 'age'],
  rows: [
    [1, 'דנה', 'לוי', 'מכירות', 9000, 28],
    [2, 'יוסי', 'כהן', 'IT', 12000, 35],
    [3, 'מיכל', 'אברהם', 'שיווק', 8500, 31],
    [4, 'אבי', 'ברק', 'מכירות', 7500, 25],
    [5, 'רות', 'גלעד', 'HR', 10000, 42],
  ],
}]

export const level01Exercises: Exercise[] = [
  {
    id: 'level01-ex01',
    levelId: 1,
    title: 'שלוף את כל הנתונים',
    description: 'הצג את כל השורות והעמודות מטבלת העובדים.',
    schema,
    sampleData,
    expectedQuery: 'SELECT * FROM employees',
    requiredConcepts: [],
    hints: [
      'השתמש ב-SELECT כדי לשלוף נתונים',
      'הכוכבית (*) מייצגת "את כל העמודות"',
      'SELECT * FROM employees',
    ],
    explanation: 'SELECT * FROM employees שולף את כל העמודות מכל השורות בטבלת employees. הכוכבית (*) היא קיצור ל"כל העמודות".',
  },
  {
    id: 'level01-ex02',
    levelId: 1,
    title: 'מה יש בטבלת employees?',
    description: 'כתוב שאילתה שמציגה את כל המידע על כל העובדים בחברה.',
    schema,
    sampleData,
    expectedQuery: 'SELECT * FROM employees',
    requiredConcepts: [],
    hints: [
      'כדי לשלוף הכל, השתמש ב-SELECT *',
      'אחרי SELECT * צריך לציין מאיפה לשלוף עם FROM',
      'SELECT * FROM employees',
    ],
    explanation: 'כל שאילתת SELECT מתחילה ב-SELECT (מה לשלוף) ואחריה FROM (מאיזו טבלה). SELECT * FROM employees מחזיר את כל 5 העובדים עם כל 6 העמודות.',
  },
  {
    id: 'level01-ex03',
    levelId: 1,
    title: 'חקור את הטבלה',
    description: 'כתוב שאילתה שמציגה את כל הנתונים שיש בטבלת employees. כמה עובדים יש? כמה עמודות?',
    schema,
    sampleData,
    expectedQuery: 'SELECT * FROM employees',
    requiredConcepts: [],
    hints: [
      'SELECT * שולף את כל העמודות',
      'FROM מציין את שם הטבלה',
      'SELECT * FROM employees',
    ],
    explanation: 'הטבלה מכילה 5 עובדים ו-6 עמודות. SELECT * FROM employees מציג את כולם. שים לב לשמות העמודות — תצטרך אותם בתרגילים הבאים.',
  },
  {
    id: 'level01-ex04',
    levelId: 1,
    title: 'טבלת לקוחות',
    description: 'הצג את כל הנתונים מטבלת הלקוחות.',
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
    expectedQuery: 'SELECT * FROM customers',
    requiredConcepts: [],
    hints: [
      'השתמש ב-SELECT *',
      'שם הטבלה הוא customers',
      'SELECT * FROM customers',
    ],
    explanation: 'SELECT * FROM customers שולף את כל 5 הלקוחות עם כל 5 העמודות שלהם.',
  },
  {
    id: 'level01-ex05',
    levelId: 1,
    title: 'שלוף מוצרים',
    description: 'הצג את כל המוצרים הקיימים בחנות.',
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
    expectedQuery: 'SELECT * FROM products',
    requiredConcepts: [],
    hints: [
      'SELECT * לשליפת הכל',
      'FROM products מציין את הטבלה',
      'SELECT * FROM products',
    ],
    explanation: 'SELECT * FROM products מציג את כל 5 המוצרים. שים לב לעמודות: product_name, category, price, stock — תשתמש בהן בהמשך.',
  },
  {
    id: 'level01-ex06',
    levelId: 1,
    title: 'טבלת סטודנטים',
    description: 'שלוף את כל הנתונים מטבלת הסטודנטים.',
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
    expectedQuery: 'SELECT * FROM students',
    requiredConcepts: [],
    hints: [
      'SELECT * לשליפת כל העמודות',
      'שם הטבלה: students',
      'SELECT * FROM students',
    ],
    explanation: 'SELECT * FROM students מחזיר את כל 5 הסטודנטים. בתרגילים הבאים תתחיל לסנן ולבחור עמודות ספציפיות.',
  },
  {
    id: 'level01-ex07',
    levelId: 1,
    title: 'טבלת הזמנות',
    description: 'הצג את כל ההזמנות שנכנסו למערכת.',
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
    expectedQuery: 'SELECT * FROM orders',
    requiredConcepts: [],
    hints: [
      'השתמש ב-SELECT *',
      'שם הטבלה: orders',
      'SELECT * FROM orders',
    ],
    explanation: 'SELECT * FROM orders מציג את כל 5 ההזמנות. שים לב לסטטוס — יש שולם, ממתין ובוטל.',
  },
  {
    id: 'level01-ex08',
    levelId: 1,
    title: 'טבלת מחלקות',
    description: 'שלוף את כל המחלקות בחברה.',
    schema: `
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
`,
    sampleData: [{
      tableName: 'departments',
      columns: ['dept_id', 'dept_name', 'manager_name'],
      rows: [
        [10, 'מכירות', 'יוסי כהן'],
        [20, 'IT', 'רחל לוי'],
        [30, 'שיווק', 'אבי ברק'],
        [40, 'HR', 'מיכל גל'],
      ],
    }],
    expectedQuery: 'SELECT * FROM departments',
    requiredConcepts: [],
    hints: [
      'SELECT * לשליפת הכל',
      'שם הטבלה: departments',
      'SELECT * FROM departments',
    ],
    explanation: 'SELECT * FROM departments מציג את 4 המחלקות. בהמשך תחבר טבלה זו עם טבלת עובדים בעזרת JOIN.',
  },
]
