const fs = require('fs')
const mysql = require('mysql')
const serverCa = [fs.readFileSync('/var/www/html/DigiCertGlobalRootCA.crt.pem', 'utf8')]
const conn = mysql.createConnection({
  host: process.env.MYSQL_DB_HOST,
  user: process.env.MYSQL_DB_USER,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB,
  port: 3306,
  // ssl: {
  //   ca: fs.readFileSync('../../jS/CONFIG/DigiCertGlobalRootCA.crt.pem')
  // }
  ssl: {
    rejectUnauthorized: true,
    ca: serverCa
  }
})
conn.connect(function (err) {
  console.log('err:', err)
  if (err) throw err
})
