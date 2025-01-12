import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const port = 3000;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'world',
  password: '',
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM visited_countries');
    const countryCodes = result.rows.map(row => row.country_code).join(',');
    res.render('index', { visitedCountries: result.rows, total: result.rowCount, countries: countryCodes });
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});

app.post("/add", async (req, res) => {
  const country = req.body.country.toUpperCase();
  try {
    const checkResult = await pool.query('SELECT * FROM visited_countries WHERE UPPER(country_code) = $1', [country]);
    if (checkResult.rowCount > 0) {
      return res.json({ success: false, error: 'Country already added' });
    }
    await pool.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [country]);
    res.json({ success: true, country });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/remove", async (req, res) => {
  const country = req.body.country.toUpperCase();
  try {
    const result = await pool.query('DELETE FROM visited_countries WHERE UPPER(country_code) = $1', [country]);
    if (result.rowCount > 0) {
      res.json({ success: true, country });
    } else {
      res.json({ success: false, error: 'Country not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
