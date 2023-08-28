const mysql = require('mysql');
//const { Pool } = require('mysql');
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',  // MySQL username
  password: 'J@v@2023',  // MySQL password
  database: 'mysql',  // MySQL database name
  port: 3307,  // MySQL port (default is 3306)
  connectionLimit: 10,  // Maximum number of connections in the pool
});

module.exports = pool;
