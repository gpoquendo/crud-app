const mysql = require('mysql');

     const connection = mysql.createConnection({
       host: 'your_mysql_host',
       user: 'your_mysql_user',
       password: 'your_mysql_password',
       database: 'your_database_name'
     });

     connection.connect((err) => {
       if (err) {
         console.error('Error connecting to MySQL: ' + err.stack);
         return;
       }
       console.log('Connected to MySQL as id ' + connection.threadId);
     });