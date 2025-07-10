import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

export const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASS || '',
  database: process.env.MYSQL_DB || 'u890664939_evohome',
});
