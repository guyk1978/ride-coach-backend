const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'srv535.hstgr.io',      // או 185.28.21.52
  user: 'ebikeroutes_db',
  password: 'Kesem111@',          // הסיסמה החדשה
  database: 'u220582403_ebikeroutes_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
