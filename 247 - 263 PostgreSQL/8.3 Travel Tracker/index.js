import express from "express";
import bodyParser from "body-parser";
import pkg from "pg";

// Import necessary modules and packages
const { Pool } = pkg;

const app = express(); // Create an Express application
const port = 3000; // Define the port to run the server

const pool = new Pool({
  user: '', // Add your database username
  host: '', // Add your database host
  database: '', // Add your database name
  password: '', // Add your database password
  port: 5432, // PostgreSQL port number
});

// Middleware to parse URL-encoded data and JSON data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static("public"));

// Set the view engine to EJS for rendering views
app.set('view engine', 'ejs');

// Endpoint to get the country code based on the country name
app.post("/get-country-code", async (req, res) => {
  const { country_name } = req.body; // Extract country name from the request body
  try {
    const result = await pool.query('SELECT country_code FROM country_mapping WHERE LOWER(country_name) = LOWER($1)', [country_name]);
    if (result.rowCount > 0) {
      res.json({ success: true, country_code: result.rows[0].country_code }); // Return the country code if found
    } else {
      res.json({ success: false, error: 'Country not found' }); // Return an error if the country is not found
    }
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ success: false, error: err.message }); // Return a server error response
  }
});

// Endpoint to render the main page
app.get("/", async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM visited_countries');
    const countryCodes = result.rows.map(row => row.country_code).join(','); // Get the list of country codes
    res.render('index', { visitedCountries: result.rows, total: result.rowCount, countries: countryCodes }); // Render the index page with data
  } catch (err) {
    console.error(err); // Log any errors
    res.send("Error " + err); // Return an error response
  }
});

// Endpoint to add a new visited country
app.post("/add", async (req, res) => {
  let { country } = req.body; // Extract country from the request body
  try {
    const result = await pool.query('SELECT country_code FROM country_mapping WHERE LOWER(country_name) = LOWER($1)', [country]);
    if (result.rowCount > 0) {
      country = result.rows[0].country_code; // Convert country name to country code if found
    } else {
      country = country.toUpperCase(); // Treat input as a country code and convert to uppercase
      if (country.length !== 2) {
        return res.json({ success: false, error: 'Invalid country code' }); // Return an error if the country code is invalid
      }
    }

    const checkResult = await pool.query('SELECT * FROM visited_countries WHERE UPPER(country_code) = $1', [country]);
    if (checkResult.rowCount > 0) {
      return res.json({ success: false, error: 'Country already added' }); // Return an error if the country is already added
    }

    await pool.query('INSERT INTO visited_countries (country_code) VALUES ($1)', [country]); // Insert the new country into the table

    const totalResult = await pool.query('SELECT COUNT(*) FROM visited_countries');
    const total = totalResult.rows[0].count; // Get the total count of visited countries

    res.json({ success: true, country, total }); // Return a success response with the updated total
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ success: false, error: err.message }); // Return a server error response
  }
});

// Endpoint to remove a visited country
app.post("/remove", async (req, res) => {
  let { country } = req.body; // Extract country from the request body
  try {
    let countryCode = country.toUpperCase(); // Convert input to uppercase assuming it's a country code
    if (country.length !== 2) {
      const result = await pool.query('SELECT country_code FROM country_mapping WHERE LOWER(country_name) = LOWER($1)', [country]);
      if (result.rowCount > 0) {
        countryCode = result.rows[0].country_code; // Convert country name to country code if found
      } else {
        return res.json({ success: false, error: 'Country not found' }); // Return an error if the country is not found
      }
    }

    const deleteResult = await pool.query('DELETE FROM visited_countries WHERE UPPER(country_code) = $1', [countryCode]);
    if (deleteResult.rowCount > 0) {
      const totalResult = await pool.query('SELECT COUNT(*) FROM visited_countries');
      const total = totalResult.rows[0].count; // Get the total count of visited countries
      res.json({ success: true, country: countryCode, total }); // Return a success response with the updated total
    } else {
      res.json({ success: false, error: 'Country not found' }); // Return an error if the country was not in the list
    }
  } catch (err) {
    console.error(err); // Log any errors
    res.status(500).json({ success: false, error: err.message }); // Return a server error response
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
