const mysql = require('mysql2');

// connection to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password: 'Fugma!123',
        database: 'employee_db',
    },
    console.log('Connected to the employee_db database')
);

// export promise-based query
module.exports = db.promise();