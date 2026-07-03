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

export const level08Exercises: Exercise[] = [
  {
    id: 'level08-ex01',
    levelId: 8,
    title: 'מיון לפי שכר יורד',
    description: 'הצג את כל העובדים ממוינים לפי משכורת מהגבוהה לנמוכה.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees ORDER BY salary DESC',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' }],
    hints: [
      'ORDER BY קובע סדר המיון',
      'DESC = יורד (מהגבוה לנמוך)',
      'SELECT * FROM employees ORDER BY salary DESC',
    ],
    explanation: 'ORDER BY salary DESC ממיין מהמשכורת הגבוהה לנמוכה. ללא DESC (ברירת מחדל) הסדר יהיה עולה.',
  },
  {
    id: 'level08-ex02',
    levelId: 8,
    title: 'מיון לפי שם (א-ת)',
    description: 'הצג את כל העובדים ממוינים לפי שם פרטי בסדר אלפביתי (עולה).',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees ORDER BY first_name ASC',    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' }],
    hints: [
      'ORDER BY first_name ימיין לפי שם',
      'ASC = עולה (ברירת מחדל)',
      'SELECT * FROM employees ORDER BY first_name ASC',
    ],
    explanation: 'ASC (עולה) הוא ברירת המחדל — ניתן לכתוב אותו או להשמיטו. ORDER BY first_name ו-ORDER BY first_name ASC זהים.',
  },
  {
    id: 'level08-ex03',
    levelId: 8,
    title: 'מיון עם WHERE',
    description: 'הצג עובדי IT ממוינים לפי משכורת מהגבוהה לנמוכה.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT first_name, salary FROM employees WHERE department = 'IT' ORDER BY salary DESC",
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' },
    ],
    hints: [
      'WHERE קודם, אחריו ORDER BY',
      "WHERE department = 'IT' ORDER BY salary DESC",
      "SELECT first_name, salary FROM employees WHERE department = 'IT' ORDER BY salary DESC",
    ],
    explanation: 'סדר הפקודות: WHERE (מה לסנן) → ORDER BY (איך למיין). WHERE תמיד לפני ORDER BY.',
  },
  {
    id: 'level08-ex04',
    levelId: 8,
    title: 'מיון לפי שתי עמודות',
    description: 'הצג עובדים ממוינים קודם לפי מחלקה (א-ת) ואחר כך לפי משכורת (מהגבוהה לנמוכה).',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT * FROM employees ORDER BY department ASC, salary DESC',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' }],
    hints: [
      'ניתן למיין לפי מספר עמודות — מפרידים בפסיק',
      'ORDER BY department ASC, salary DESC',
      'SELECT * FROM employees ORDER BY department ASC, salary DESC',
    ],
    explanation: 'מיון מרובה: קודם לפי מחלקה, ואז בתוך כל מחלקה לפי משכורת יורדת.',
  },
  {
    id: 'level08-ex05',
    levelId: 8,
    title: 'מוצרים ממוינים לפי מחיר',
    description: 'הצג את שם המוצר והמחיר ממוינים מהזול ליקר.',
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
  (5, 'טלפון', 'אלקטרוניקה', 2200);
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
      ],
    }],
    expectedQuery: 'SELECT product_name, price FROM products ORDER BY price ASC',    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' }],
    hints: [
      'ASC = עולה (מהזול ליקר)',
      'ORDER BY price ASC',
      'SELECT product_name, price FROM products ORDER BY price ASC',
    ],
    explanation: 'ORDER BY price ASC: עכבר (120), כיסא (450), שולחן (800), טלפון (2200), מחשב (3500).',
  },
  {
    id: 'level08-ex06',
    levelId: 8,
    title: 'הזמנות ממוינות לפי סכום',
    description: 'הצג את מספר ההזמנה והסכום, ממוינות מהגדול לקטן.',
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
    expectedQuery: 'SELECT order_id, amount FROM orders ORDER BY amount DESC',
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' }],
    hints: [
      'ORDER BY amount DESC ממיין מהגדול לקטן',
      'SELECT order_id, amount FROM orders ORDER BY amount DESC',
      'SELECT order_id, amount FROM orders ORDER BY amount DESC',
    ],
    explanation: 'ORDER BY amount DESC: הזמנה 103 (3200) ראשונה, הזמנה 102 (450) אחרונה.',
  },
  {
    id: 'level08-ex07',
    levelId: 8,
    title: 'DISTINCT עם ORDER BY',
    description: 'הצג את כל הערים הייחודיות ממוינות אלפביתית.',
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
  (5, 'כרמל', 'באר שבע');
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
      ],
    }],
    expectedQuery: 'SELECT DISTINCT city FROM customers ORDER BY city ASC',    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'DISTINCT', message: 'המשימה מחייבת שימוש ב-DISTINCT' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' },
    ],
    hints: [
      'DISTINCT מסיר כפילויות, ORDER BY ממיין',
      'SELECT DISTINCT city FROM customers ORDER BY city',
      'SELECT DISTINCT city FROM customers ORDER BY city ASC',
    ],
    explanation: 'ניתן לשלב DISTINCT עם ORDER BY. ה-DISTINCT פועל קודם, ואז ORDER BY ממיין את הערכים הייחודיים.',
  },
  {
    id: 'level08-ex08',
    levelId: 8,
    title: 'WHERE + ORDER BY משולב',
    description: 'הצג את שם הפרטי, מחלקה ומשכורת של עובדים עם משכורת מעל 8,500 — ממוינים לפי גיל עולה.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, department, salary FROM employees WHERE salary > 8500 ORDER BY age ASC',    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' },
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'המשימה מחייבת שימוש ב-ORDER BY' },
    ],
    hints: [
      'WHERE מסנן, ORDER BY ממיין — WHERE תמיד לפני ORDER BY',
      'WHERE salary > 8500 ORDER BY age ASC',
      'SELECT first_name, department, salary FROM employees WHERE salary > 8500 ORDER BY age ASC',
    ],
    explanation: 'גם WHERE וגם ORDER BY: תחילה WHERE מסנן (salary > 8500), אחר כך ORDER BY age ASC ממיין את התוצאה.',
  },
  {
    id: 'level08-ex09',
    levelId: 8,
    title: 'שלוש המשכורות הגבוהות (top-N)',
    description: 'הצג את השם הפרטי והמשכורת של שלושת העובדים בעלי המשכורת הגבוהה ביותר.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, salary FROM employees ORDER BY salary DESC LIMIT 3',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'כדי למצוא את הגבוהים ביותר יש למיין עם ORDER BY' },
      { type: 'requiresKeyword', keyword: 'LIMIT', message: 'להגבלת מספר השורות המוחזרות השתמש ב-LIMIT' },
    ],
    hints: [
      'כדי למצוא את ה"הכי גבוהים", קודם ממיינים מהגבוה לנמוך',
      'LIMIT בא בסוף השאילתה, אחרי ORDER BY, וקובע כמה שורות יוחזרו',
      'המבנה: SELECT ... ORDER BY salary DESC LIMIT 3',
    ],
    explanation: 'top-N: קודם ORDER BY salary DESC ממיין מהגבוה לנמוך, ואז LIMIT 3 לוקח רק את שלוש השורות הראשונות. יוסי (12000), תום (11000), רות (10000).',
  },
  {
    id: 'level08-ex10',
    levelId: 8,
    title: 'שני הצעירים ביותר',
    description: 'הצג את השם הפרטי והגיל של שני העובדים הצעירים ביותר.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, age FROM employees ORDER BY age ASC LIMIT 2',    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'כדי למצוא את הצעירים ביותר יש למיין עם ORDER BY' },
      { type: 'requiresKeyword', keyword: 'LIMIT', message: 'להגבלת מספר השורות המוחזרות השתמש ב-LIMIT' },
    ],
    hints: [
      'ה"צעירים ביותר" = הגיל הנמוך ביותר, כלומר מיון עולה (ASC)',
      'אחרי המיון, LIMIT 2 יחזיר רק את שתי השורות הראשונות',
      'המבנה: SELECT ... ORDER BY age ASC LIMIT 2',
    ],
    explanation: 'למצוא את הצעירים ביותר: ORDER BY age ASC ממיין מהצעיר למבוגר, ו-LIMIT 2 לוקח את שני הראשונים. אבי (25), דנה (28).',
  },
  {
    id: 'level08-ex11',
    levelId: 8,
    title: 'המוצר היקר ביותר',
    description: 'הצג את שם המוצר והמחיר של המוצר היקר ביותר בלבד.',
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
  (5, 'טלפון', 'אלקטרוניקה', 2200);
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
      ],
    }],
    expectedQuery: 'SELECT product_name, price FROM products ORDER BY price DESC LIMIT 1',
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'ORDER BY', message: 'למציאת היקר ביותר יש למיין עם ORDER BY' },
      { type: 'requiresKeyword', keyword: 'LIMIT', message: 'להצגת שורה אחת בלבד השתמש ב-LIMIT' },
    ],
    hints: [
      'היקר ביותר = מיון יורד לפי מחיר, ואז לוקחים רק את הראשון',
      'LIMIT 1 מחזיר שורה אחת בלבד',
      'המבנה: SELECT ... ORDER BY price DESC LIMIT 1',
    ],
    explanation: 'למצוא ערך קיצון בודד עם top-N: ORDER BY price DESC מביא את היקר ביותר לראש, ו-LIMIT 1 לוקח רק אותו. מחשב נייד (3500).',
  },
]
