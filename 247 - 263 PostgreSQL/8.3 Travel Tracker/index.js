import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

const { Pool } = pkg;

const app = express();
const port = 3000;

const pool = new Pool({
  user: '',
  host: '',
  database: '',
  password: '',
  port: 5432,
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.set('view engine', 'ejs');

app.post("/get-country-code", async (req, res) => {
  const { country_name } = req.body;
  try {
    const result = await pool.query('SELECT country_code FROM country_mapping WHERE LOWER(country_name) = LOWER($1)', [country_name]);
    if (result.rowCount > 0) {
      res.json({ success: true, country_code: result.rows[0].country_code });
    } else {
      res.json({ success: false, error: 'Country not found' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

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
  let { country } = req.body;
  try {
    const result = await pool.query('SELECT country_code FROM country_mapping WHERE LOWER(country_name) = LOWER($1)', [country]);
    if (result.rowCount > 0) {
      country = result.rows[0].country_code;
    } else {
      country = country.toUpperCase();
      if (country.length !== 2) {
        return res.json({ success: false, error: 'Invalid country code' });
      }
    }

    const checkResult = await pool.query('SELECT * FROM visited_countries WHERE UPPER(country_code) = $1', [country]);
    if (checkResult.rowCount > 0) {
      return res.json({ success: false, error: 'Country already added' });
    }

    await pool.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [country]);

    const totalResult = await pool.query('SELECT COUNT(*) FROM visited_countries');
    const total = totalResult.rows[0].count;

    res.json({ success: true, country, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post("/remove", async (req, res) => {
  let { country } = req.body;
  try {
    let countryCode = country.toUpperCase();
    if (country.length !== 2) {
      const result = await pool.query('SELECT country_code FROM country_mapping WHERE LOWER(country_name) = LOWER($1)', [country]);
      if (result.rowCount > 0) {
        countryCode = result.rows[0].country_code;
      } else {
        return res.json({ success: false, error: 'Country not found' });
      }
    }

    const deleteResult = await pool.query('DELETE FROM visited_countries WHERE UPPER(country_code) = $1', [countryCode]);
    if (deleteResult.rowCount > 0) {
      const totalResult = await pool.query('SELECT COUNT(*) FROM visited_countries');
      const total = totalResult.rows[0].count;
      res.json({ success: true, country: countryCode, total });
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
