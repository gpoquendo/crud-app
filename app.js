const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const port = 3000;

// Database setup
const db = mysql.createConnection({
  host: 'localhost',
  user: 'gpoquendo',
  password: 'admin',
  database: 'crud_db',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed: ' + err.stack);
    return;
  }
  console.log('Connected to the database');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret: 'your-secret-key', resave: true, saveUninitialized: true }));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

// CREATE
app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  const { name, address, phone, email } = req.body;
  const insertQuery = 'INSERT INTO contacts (name, address, phone, email) VALUES (?, ?, ?, ?)';
  db.query(insertQuery, [name, address, phone, email], (err, results) => {
    if (err) throw err;
    res.redirect('/read');
  });
});

// READ
app.get('/read', (req, res) => {
  const selectQuery = 'SELECT * FROM contacts';
  db.query(selectQuery, (err, results) => {
    if (err) throw err;
    res.render('index', { contacts: results });
  });
});

// UPDATE
app.post('/update', (req, res) => {
  const { id, name, address, phone, email } = req.body;
  const updateQuery = 'UPDATE contacts SET name=?, address=?, phone=?, email=? WHERE id=?';
  db.query(updateQuery, [name, address, phone, email, id], (err, results) => {
    if (err) throw err;
    res.redirect('/read');
  });
});

// DELETE
app.post('/delete', (req, res) => {
  const { id } = req.body;
  const deleteQuery = 'DELETE FROM contacts WHERE id=?';
  db.query(deleteQuery, [id], (err, results) => {
    if (err) throw err;
    res.redirect('/read');
  });
});

// EDIT - handle GET requests for editing a contact
app.get('/edit/:id', (req, res) => {
  const contactId = req.params.id;
  const selectQuery = 'SELECT * FROM contacts WHERE id=?';
  db.query(selectQuery, [contactId], (err, results) => {
    if (err) throw err;

    // Check if a contact with the given ID exists
    if (results.length > 0) {
      const contact = results[0];
      res.render('edit', { contact });
    } else {
      // Handle the case where the contact with the given ID is not found
      res.redirect('/read');
    }
  });
});

// NEW - handle GET requests for displaying detailed information about a contact
app.get('/details/:id', (req, res) => {
  const contactId = req.params.id;
  const selectQuery = 'SELECT * FROM contacts WHERE id=?';
  db.query(selectQuery, [contactId], (err, results) => {
    if (err) throw err;

    // Check if a contact with the given ID exists
    if (results.length > 0) {
      const contact = results[0];
      res.render('details', { contact });
    } else {
      // Handle the case where the contact with the given ID is not found
      res.redirect('/read');
    }
  });
});

// Landing page
app.get('/', (req, res) => {
  const selectQuery = 'SELECT * FROM contacts';
  db.query(selectQuery, (err, results) => {
    if (err) throw err;
    res.render('index', { contacts: results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});