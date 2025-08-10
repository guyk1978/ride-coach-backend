const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: 'localhost',                  // או הכתובת שקיבלת מ־Hostinger
  user: 'u220582403',                 // שם המשתמש למסד
  password: '|t4SR36T5UL',       // הסיסמה שלך למסד
  database: 'u220582403_ebikeroutes_db',  // שם מסד הנתונים
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
