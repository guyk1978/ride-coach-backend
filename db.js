const pool = mysql.createPool({
  host: 'srv535.hstgr.io',
  user: 'u220582403',  // בדוק שם משתמש מדויק
  password: 'Kesem111@',
  database: 'u220582403_ebikeroutes_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


module.exports = pool.promise();
