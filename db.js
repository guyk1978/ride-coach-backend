const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'srv535.hstgr.io',      // או 185.28.21.52 – אפשר לבחור אחד מהם
  user: 'u220582403',           // שם המשתמש שלך
  password: '|t4SR36T5UL',      // הסיסמה שלך
  database: 'u220582403_ebikeroutes_db'  // שם מסד הנתונים שלך
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

module.exports = connection;
