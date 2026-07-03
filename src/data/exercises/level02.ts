import type { Exercise } from '../../types'

const empSchema = `
CREATE TABLE employees (
  employee_id INTEGER PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  department TEXT,
  salary INTEGER,
  age INTEGER,
  email TEXT
);
INSERT INTO employees VALUES
  (1, 'דנה', 'לוי', 'מכירות', 9000, 28, 'dana@co.com'),
  (2, 'יוסי', 'כהן', 'IT', 12000, 35, 'yossi@co.com'),
  (3, 'מיכל', 'אברהם', 'שיווק', 8500, 31, 'michal@co.com'),
  (4, 'אבי', 'ברק', 'מכירות', 7500, 25, 'avi@co.com'),
  (5, 'רות', 'גלעד', 'HR', 10000, 42, 'ruth@co.com');
`

const empSample = [{
  tableName: 'employees',
  columns: ['employee_id', 'first_name', 'last_name', 'department', 'salary', 'age', 'email'],
  rows: [
    [1, 'דנה', 'לוי', 'מכירות', 9000, 28, 'dana@co.com'],
    [2, 'יוסי', 'כהן', 'IT', 12000, 35, 'yossi@co.com'],
    [3, 'מיכל', 'אברהם', 'שיווק', 8500, 31, 'michal@co.com'],
    [4, 'אבי', 'ברק', 'מכירות', 7500, 25, 'avi@co.com'],
    [5, 'רות', 'גלעד', 'HR', 10000, 42, 'ruth@co.com'],
  ],
}]

export const level02Exercises: Exercise[] = [
  {
    id: 'level02-ex01',
    levelId: 2,
    title: 'שם פרטי ומשפחה בלבד',
    description: 'הצג רק את השם הפרטי ושם המשפחה של כל העובדים.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, last_name FROM employees',
    requiredConcepts: [],
    hints: [
      'במקום * ציין את שמות העמודות',
      'הפרד בין עמודות בפסיק',
      'SELECT first_name, last_name FROM employees',
    ],
    explanation: 'כאשר מציינים שמות עמודות ספציפיים, SQL מחזיר רק אותן. first_name ו-last_name הן שמות העמודות בטבלה.',
  },
  {
    id: 'level02-ex02',
    levelId: 2,
    title: 'שם ומשכורת',
    description: 'הצג את השם הפרטי והמשכורת של כל העובדים.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, salary FROM employees',
    requiredConcepts: [],
    hints: [
      'בחר שתי עמודות: first_name ו-salary',
      'הפרד בין עמודות בפסיק',
      'SELECT first_name, salary FROM employees',
    ],
    explanation: 'SELECT first_name, salary FROM employees שולף רק את העמודות הנחוצות. פחות נתונים = ביצועים טובים יותר.',
  },
  {
    id: 'level02-ex03',
    levelId: 2,
    title: 'כינוי לעמודה (AS)',
    description: 'הצג את השם הפרטי והמשכורת — אבל שנה את שם העמודה salary ל-"משכורת".',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT first_name, salary AS משכורת FROM employees",
    requiredConcepts: [],
    hints: [
      'AS מאפשר לתת שם חלופי לעמודה',
      'הכינוי מופיע אחרי AS',
      "SELECT first_name, salary AS משכורת FROM employees",
    ],
    explanation: 'AS יוצר כינוי (alias) לעמודה בתוצאה. המשכורת עדיין מגיעה מעמודת salary, אבל הכותרת בתוצאה תהיה "משכורת".',
  },
  {
    id: 'level02-ex04',
    levelId: 2,
    title: 'שם ומחלקה',
    description: 'הצג את השם הפרטי, שם המשפחה והמחלקה של כל העובדים.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, last_name, department FROM employees',
    requiredConcepts: [],
    hints: [
      'בחר שלוש עמודות: first_name, last_name, department',
      'הפרד בין עמודות בפסיקים',
      'SELECT first_name, last_name, department FROM employees',
    ],
    explanation: 'ניתן לבחור כמה עמודות שרוצים. רק מקפידים להפריד ביניהן בפסיקים.',
  },
  {
    id: 'level02-ex05',
    levelId: 2,
    title: 'כינוי בעברית',
    description: 'הצג את השם הפרטי עם הכותרת "שם" ואת הגיל עם הכותרת "גיל".',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: "SELECT first_name AS שם, age AS גיל FROM employees",
    requiredConcepts: [],
    hints: [
      'השתמש ב-AS לכינוי בעברית',
      'ניתן לתת כינוי לכל עמודה',
      "SELECT first_name AS שם, age AS גיל FROM employees",
    ],
    explanation: 'AS מאפשר לתת כינוי בעברית לכל עמודה. כך התוצאה מוצגת עם כותרות מובנות יותר.',
  },
  {
    id: 'level02-ex06',
    levelId: 2,
    title: 'פרטי קשר',
    description: 'הצג רק את השם הפרטי, שם המשפחה וכתובת האימייל של כל העובדים.',
    schema: empSchema,
    sampleData: empSample,
    expectedQuery: 'SELECT first_name, last_name, email FROM employees',
    requiredConcepts: [],
    hints: [
      'שמות העמודות: first_name, last_name, email',
      'הפרד ביניהן בפסיקים',
      'SELECT first_name, last_name, email FROM employees',
    ],
    explanation: 'כאשר יש טבלה עם הרבה עמודות ואנחנו רוצים רק את פרטי הקשר — בוחרים רק את העמודות הרלוונטיות.',
  },
  {
    id: 'level02-ex07',
    levelId: 2,
    title: 'מוצרים — שם ומחיר',
    description: 'מטבלת המוצרים, הצג רק את שם המוצר (product_name) ומחירו (price).',
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
    expectedQuery: 'SELECT product_name, price FROM products',
    requiredConcepts: [],
    hints: [
      'שם הטבלה: products',
      'העמודות הנדרשות: product_name ו-price',
      'SELECT product_name, price FROM products',
    ],
    explanation: 'SELECT product_name, price FROM products מחזיר רק שתי עמודות מתוך חמש — בדיוק מה שנדרש.',
  },
  {
    id: 'level02-ex08',
    levelId: 2,
    title: 'כינוי ופירוט',
    description: 'הצג את שם המוצר עם הכינוי "מוצר" ואת המחיר עם הכינוי "מחיר בש״ח" מטבלת המוצרים.',
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
    expectedQuery: "SELECT product_name AS מוצר, price AS 'מחיר בש\"ח' FROM products",    requiredConcepts: [],
    hints: [
      'השתמש ב-AS לכל עמודה',
      'כינוי עם רווח מוקף בגרשיים: AS \'מחיר בש"ח\'',
      "SELECT product_name AS מוצר, price AS מחיר FROM products",
    ],
    explanation: 'AS מאפשר לתת כינוי לכל עמודה. כינוי עם רווח מוקף בגרשיים בודדים. בתרגיל הזה גם "מחיר" לבד נחשב תשובה קרובה.',
  },
]
