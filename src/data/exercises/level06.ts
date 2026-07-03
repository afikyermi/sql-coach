import type { Exercise } from '../../types'

const custSchema = `
CREATE TABLE customers (
  customer_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  city TEXT,
  email TEXT
);
INSERT INTO customers VALUES
  (1, 'אלכסנדרה', 'שמיר', 'תל אביב', 'alex@gmail.com'),
  (2, 'אמיר', 'לוי', 'חיפה', 'amir@hotmail.com'),
  (3, 'בינה', 'ציון', 'ירושלים', 'bina@yahoo.com'),
  (4, 'נועה', 'הרץ', 'תל אביב', 'noa@gmail.com'),
  (5, 'כרמל', 'אוחיון', 'באר שבע', 'carmel@walla.co.il'),
  (6, 'שגב', 'אביב', 'תל אביב', 'shgav@gmail.com'),
  (7, 'דינה', 'מרון', 'חיפה', 'dina@work.org');
`
const custSample = [{
  tableName: 'customers',
  columns: ['customer_id', 'first_name', 'last_name', 'city', 'email'],
  rows: [
    [1, 'אלכסנדרה', 'שמיר', 'תל אביב', 'alex@gmail.com'],
    [2, 'אמיר', 'לוי', 'חיפה', 'amir@hotmail.com'],
    [3, 'בינה', 'ציון', 'ירושלים', 'bina@yahoo.com'],
    [4, 'נועה', 'הרץ', 'תל אביב', 'noa@gmail.com'],
    [5, 'כרמל', 'אוחיון', 'באר שבע', 'carmel@walla.co.il'],
    [6, 'שגב', 'אביב', 'תל אביב', 'shgav@gmail.com'],
    [7, 'דינה', 'מרון', 'חיפה', 'dina@work.org'],
  ],
}]

export const level06Exercises: Exercise[] = [
  {
    id: 'level06-ex01',
    levelId: 6,
    title: 'שם שמתחיל ב-א',
    description: 'הצג לקוחות ששם פרטיהם מתחיל באות "א".',
    schema: custSchema,
    sampleData: custSample,
    expectedQuery: "SELECT * FROM customers WHERE first_name LIKE 'א%'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE לחיפוש תבנית' }],
    hints: [
      'LIKE עם % מאפשר חיפוש חלקי בטקסט',
      "'א%' מוצא שמות שמתחילים ב-א",
      "SELECT * FROM customers WHERE first_name LIKE 'א%'",
    ],
    explanation: "'א%' — ה-% מייצג כל רצף תווים שבא אחרי א. אלכסנדרה ואמיר יוחזרו.",
  },
  {
    id: 'level06-ex02',
    levelId: 6,
    title: 'אימייל של Gmail',
    description: 'הצג לקוחות שכתובת האימייל שלהם מכילה gmail.',
    schema: custSchema,
    sampleData: custSample,
    expectedQuery: "SELECT first_name, email FROM customers WHERE email LIKE '%gmail%'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE' }],
    hints: [
      "'%gmail%' מוצא כל ערך שמכיל את המחרוזת gmail",
      'WHERE email LIKE \'%gmail%\'',
      "SELECT first_name, email FROM customers WHERE email LIKE '%gmail%'",
    ],
    explanation: "% בשני הצדדים אומר: לא משנה מה לפני ומה אחרי, כל עוד gmail נמצא בתוך הטקסט.",
  },
  {
    id: 'level06-ex03',
    levelId: 6,
    title: 'שם שנגמר ב-ה',
    description: 'הצג לקוחות שעירם מסתיימת בתו "א" (כגון חיפה, באר שבע, ירושלים — ותל אביב לא כי מסתיים ב-ב).',
    schema: custSchema,
    sampleData: custSample,
    expectedQuery: "SELECT * FROM customers WHERE city LIKE '%א'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE' }],
    hints: [
      "'%א' מוצא ערכים שמסתיימים ב-א",
      "WHERE city LIKE '%א'",
      "SELECT * FROM customers WHERE city LIKE '%א'",
    ],
    explanation: "% בתחילה ו-א בסוף: כל ערך שמסתיים ב-א. חיפה ✗ (מסתיים ב-ה), ירושלים ✓ (מסתיים ב-ם... לא א). בדוק איזה ערים עונות.",
  },
  {
    id: 'level06-ex04',
    levelId: 6,
    title: 'שם משפחה עם "לו" בתוכו',
    description: 'הצג לקוחות ששם משפחתם מכיל את האותיות "לו".',
    schema: custSchema,
    sampleData: custSample,
    expectedQuery: "SELECT * FROM customers WHERE last_name LIKE '%לו%'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE' }],
    hints: [
      "'%לו%' מוצא ערכים שמכילים לו בכל מקום",
      "WHERE last_name LIKE '%לו%'",
      "SELECT * FROM customers WHERE last_name LIKE '%לו%'",
    ],
    explanation: "'%לו%': לוי ✓. שאר שמות המשפחה לא מכילים 'לו'.",
  },
  {
    id: 'level06-ex05',
    levelId: 6,
    title: 'אימייל לא Gmail',
    description: 'הצג לקוחות שכתובת האימייל שלהם לא מכילה gmail.',
    schema: custSchema,
    sampleData: custSample,
    expectedQuery: "SELECT first_name, email FROM customers WHERE email NOT LIKE '%gmail%'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE' }],
    hints: [
      'NOT LIKE הוא ההיפך של LIKE',
      "WHERE email NOT LIKE '%gmail%'",
      "SELECT first_name, email FROM customers WHERE email NOT LIKE '%gmail%'",
    ],
    explanation: "NOT LIKE '%gmail%' מחזיר לקוחות שהאימייל שלהם לא מכיל gmail.",
  },
  {
    id: 'level06-ex06',
    levelId: 6,
    title: 'חיפוש עובדים לפי תחילת שם',
    description: 'הצג עובדים ששמם הפרטי מתחיל ב-"מ".',
    schema: `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  department TEXT,
  salary INTEGER
);
INSERT INTO employees VALUES
  (1, 'מיכל', 'אברהם', 'שיווק', 8500),
  (2, 'יוסי', 'כהן', 'IT', 12000),
  (3, 'מנחם', 'ברק', 'מכירות', 7500),
  (4, 'דנה', 'לוי', 'מכירות', 9000),
  (5, 'מרים', 'גלעד', 'HR', 10000);
`,
    sampleData: [{
      tableName: 'employees',
      columns: ['employee_id', 'first_name', 'last_name', 'department', 'salary'],
      rows: [
        [1, 'מיכל', 'אברהם', 'שיווק', 8500],
        [2, 'יוסי', 'כהן', 'IT', 12000],
        [3, 'מנחם', 'ברק', 'מכירות', 7500],
        [4, 'דנה', 'לוי', 'מכירות', 9000],
        [5, 'מרים', 'גלעד', 'HR', 10000],
      ],
    }],
    expectedQuery: "SELECT * FROM employees WHERE first_name LIKE 'מ%'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE' }],
    hints: [
      "'מ%' מוצא שמות שמתחילים ב-מ",
      "WHERE first_name LIKE 'מ%'",
      "SELECT * FROM employees WHERE first_name LIKE 'מ%'",
    ],
    explanation: "LIKE 'מ%': מיכל ✓, מנחם ✓, מרים ✓. יוסי ✗, דנה ✗.",
  },
  {
    id: 'level06-ex07',
    levelId: 6,
    title: 'LIKE עם AND',
    description: 'הצג לקוחות שגרים בתל אביב וכתובת האימייל שלהם מכילה gmail.',
    schema: custSchema,
    sampleData: custSample,
    expectedQuery: "SELECT * FROM customers WHERE city = 'תל אביב' AND email LIKE '%gmail%'",
    requiredConcepts: [
      { type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE' },
      { type: 'requiresKeyword', keyword: 'WHERE', message: 'המשימה מחייבת שימוש ב-WHERE' },
    ],
    hints: [
      "שלב WHERE city = 'תל אביב' עם LIKE '%gmail%'",
      "AND email LIKE '%gmail%'",
      "SELECT * FROM customers WHERE city = 'תל אביב' AND email LIKE '%gmail%'",
    ],
    explanation: "שילוב תנאי שוויון (=) עם LIKE באמצעות AND. נועה ושגב מתל אביב עם gmail.",
  },
  {
    id: 'level06-ex08',
    levelId: 6,
    title: 'מוצר עם מילה ספציפית',
    description: 'הצג מוצרים ששם המוצר מכיל את המילה "נייד".',
    schema: `
CREATE TABLE products (
  product_id INTEGER PRIMARY KEY,
  product_name TEXT,
  category TEXT,
  price INTEGER
);
INSERT INTO products VALUES
  (1, 'מחשב נייד', 'אלקטרוניקה', 3500),
  (2, 'טאבלט נייד', 'אלקטרוניקה', 1800),
  (3, 'שולחן', 'ריהוט', 800),
  (4, 'כיסא', 'ריהוט', 450),
  (5, 'טלפון', 'אלקטרוניקה', 2200);
`,
    sampleData: [{
      tableName: 'products',
      columns: ['product_id', 'product_name', 'category', 'price'],
      rows: [
        [1, 'מחשב נייד', 'אלקטרוניקה', 3500],
        [2, 'טאבלט נייד', 'אלקטרוניקה', 1800],
        [3, 'שולחן', 'ריהוט', 800],
        [4, 'כיסא', 'ריהוט', 450],
        [5, 'טלפון', 'אלקטרוניקה', 2200],
      ],
    }],
    expectedQuery: "SELECT * FROM products WHERE product_name LIKE '%נייד%'",
    requiredConcepts: [{ type: 'requiresKeyword', keyword: 'LIKE', message: 'המשימה מחייבת שימוש ב-LIKE' }],
    hints: [
      "'%נייד%' מוצא שמות שמכילים 'נייד'",
      "WHERE product_name LIKE '%נייד%'",
      "SELECT * FROM products WHERE product_name LIKE '%נייד%'",
    ],
    explanation: "'%נייד%': מחשב נייד ✓, טאבלט נייד ✓. שני המוצרים מכילים 'נייד'.",
  },
]
