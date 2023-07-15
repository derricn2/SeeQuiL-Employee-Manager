const mysql = require('mysql2');

// connection to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'enter_user',
        password: 'enter_password',
        database: 'enter_database',
    },
    console.log('Connected to the employee_db database')
);

// export promise-based query
module.exports = db.promise();