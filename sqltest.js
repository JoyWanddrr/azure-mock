const sql = require('mysql2')
const fs = require('fs')

// const conn = sql.createConnection({ host: process.env.MYSQL_DB_HOST, user: process.env.MYSQL_DB_USER, password: process.env.MYSQL_DB_PASSWORD, database: process.env.MYSQL_DB, port: 3306, ssl: { ca: fs.readFileSync('{ca-cert filename}') } })

const config = {
  user: process.env.MYSQL_DB_USER, // better stored in an app setting such as process.env.DB_USER
  password: process.env.MYSQL_DB_PASSWORD, // better stored in an app setting such as process.env.DB_PASSWORD
  server: process.env.MYSQL_DB_HOST, // better stored in an app setting such as process.env.DB_SERVER
  port: 1433, // optional, defaults to 1433, better stored in an app setting such as process.env.DB_PORT
  database: process.env.MYSQL_DB, // better stored in an app setting such as process.env.DB_NAME
  authentication: {
    type: 'default'
  },
  options: {
    encrypt: true
  }
}

/*
    //Use Azure VM Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-vm'
        },
        options: {
            encrypt: true
        }
    }

    //Use Azure App Service Managed Identity to connect to the SQL database
    const config = {
        server: process.env["db_server"],
        port: process.env["db_port"],
        database: process.env["db_database"],
        authentication: {
            type: 'azure-active-directory-msi-app-service'
        },
        options: {
            encrypt: true
        }
    }
*/

console.log('1. Starting...')
connectAndQuery()

async function connectAndQuery () {
  try {
    const poolConnection = await sql.connect(config)

    console.log('2. Reading rows from the Table...')
    const resultSet = await poolConnection.request().query(`SELECT TOP 20 pc.Name as CategoryName,
            p.name as ProductName 
            FROM [SalesLT].[ProductCategory] pc
            JOIN [SalesLT].[Product] p ON pc.productcategoryid = p.productcategoryid`)

    console.log(`3. ${resultSet.recordset.length} rows returned.`)

    // output column headers
    let columns = ''
    for (const column in resultSet.recordset.columns) {
      columns += column + ', '
    }
    console.log('4. %s\t', columns.substring(0, columns.length - 2))

    // ouput row contents from default record set
    resultSet.recordset.forEach(row => {
      console.log('5. %s\t%s', row.CategoryName, row.ProductName)
    })

    // close connection only when we're certain application is finished
    poolConnection.close()
  } catch (err) {
    console.error(err.message)
  }
}
