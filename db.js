const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'srv535.hstgr.io',      // או 185.28.21.52
  user: 'u220582403',
  password: '|t4SR36T5UL',
  database: 'u220582403_ebikeroutes_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise();
