const mysql = require('mysql2');
const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'gpoquendo',
    password: 'admin',
    database: 'crud'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL as id ' + connection.threadId);
});

app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});