import pkg from 'pg';
const { Pool } = pkg;

import express from 'express';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'permalist',
  password: '',
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Drop table if it exists and create it
const dropTableQuery = 'DROP TABLE IF EXISTS items';
const createTableQuery = `
  CREATE TABLE IF NOT EXISTS items (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL
  )
`;

pool.query(dropTableQuery, (err, res) => {
  if (err) throw err;
  console.log('Table is successfully dropped');
  
  pool.query(createTableQuery, (err, res) => {
    if (err) throw err;
    console.log('Table is successfully created');
  });
});

// Fetch all items
const getAllItems = async () => {
  const { rows } = await pool.query('SELECT * FROM items');
  return rows;
};

app.get('/', async (req, res) => {
  const items = await getAllItems();
  res.render('index.ejs', {
    listTitle: 'Today',
    listItems: items,
  });
});

app.post('/add', async (req, res) => {
  const item = req.body.newItem;
  await pool.query('INSERT INTO items (title) VALUES ($1)', [item]);
  res.redirect('/');
});

app.post('/edit', async (req, res) => {
  const { updatedItemId, updatedItemTitle } = req.body;
  await pool.query('UPDATE items SET title = $1 WHERE id = $2', [updatedItemTitle, updatedItemId]);
  res.redirect('/');
});

app.post('/delete', async (req, res) => {
  const { deleteItemId } = req.body;
  await pool.query('DELETE FROM items WHERE id = $1', [deleteItemId]);
  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
