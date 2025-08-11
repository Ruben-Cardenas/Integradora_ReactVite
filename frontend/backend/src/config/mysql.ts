// src/config/mysql.ts
import mysql from 'mysql2/promise';

export const mysqlPool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '', // o tu contraseña si la tienes
  database: 'evohome',
});
