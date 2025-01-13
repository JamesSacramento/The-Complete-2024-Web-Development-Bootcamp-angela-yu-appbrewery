import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;  // Default user ID

// Function to get users from the database
async function getUsers() {
  const result = await db.query("SELECT * FROM users");
  return result.rows;
}

// Function to get visited countries and user color for a specific user
async function checkVisited(userId) {
  const result = await db.query(
    "SELECT country_code, users.color FROM visited_countries JOIN users ON visited_countries.user_id = users.id WHERE visited_countries.user_id = $1",
    [userId]
  );

  let countries = [];
  let userColor = "";
  result.rows.forEach((row) => {
    countries.push(row.country_code);
    userColor = row.color;  // Assuming all rows have the same color for the user
  });

  // Check if userColor is still empty (case where no countries are found)
  if (userColor === "") {
    const userResult = await db.query(
      "SELECT color FROM users WHERE id = $1",
      [userId]
    );
    if (userResult.rows.length > 0) {
      userColor = userResult.rows[0].color;
    }
  }

  return { countries, userColor };
}

app.get("/", async (req, res) => {
  const users = await getUsers();
  const { countries, userColor } = await checkVisited(currentUserId);
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: userColor,
    currentUserId: currentUserId,
  });
});

app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/new", async (req, res) => {
  console.log(req.body);  // Log the request body for debugging
  const name = req.body.name.toLowerCase(); // Convert name to lowercase
  const color = req.body.color.toLowerCase(); // Convert color to lowercase

  try {
    const result = await db.query(
      "INSERT INTO users (name, color) VALUES ($1, $2) RETURNING *",
      [name, color]
    );
    const newUser = result.rows[0];
    currentUserId = newUser.id;  // Set the new user as the current user
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.send("Error occurred while adding a new user.");
  }
});

app.post("/add", async (req, res) => {
  const input = req.body["country"].trim().toLowerCase(); // Convert input to lowercase and trim whitespace

  if (!input) {
    res.send("Please enter a valid country name.");
    return;
  }

  try {
    const result = await db.query(
      "SELECT country_code FROM country_mapping WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input]
    );

    if (result.rows.length === 0) {
      // Handle case where country is not found
      res.send("Country not found.");
    } else {
      const data = result.rows[0];
      const countryCode = data.country_code;

      // Check if the country is already visited by the user
      const checkResult = await db.query(
        "SELECT * FROM visited_countries WHERE country_code = $1 AND user_id = $2",
        [countryCode, currentUserId]
      );

      if (checkResult.rows.length > 0) {
        // Country already visited by the user
        res.send("Oops! It looks like you've already visited this country.");
      } else {
        try {
          await db.query(
            "INSERT INTO visited_countries (country_code, user_id) VALUES ($1, $2)",
            [countryCode, currentUserId]
          );
          res.redirect("/");
        } catch (err) {
          console.log(err);
          res.send("Error occurred while adding country.");
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.send("Error occurred while searching for country.");
  }
});

app.post("/user", async (req, res) => {
  const userId = req.body["user"];
  currentUserId = userId;
  res.redirect("/");
});

app.post("/remove", async (req, res) => {
  const input = req.body["country"].trim().toLowerCase(); // Convert input to lowercase and trim whitespace

  if (!input) {
    res.send("Please enter a valid country name.");
    return;
  }

  try {
    const result = await db.query(
      "SELECT country_code FROM country_mapping WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input]
    );

    if (result.rows.length === 0) {
      // Handle case where country is not found
      res.send("Country not found.");
    } else {
      const data = result.rows[0];
      const countryCode = data.country_code;

      // Check if the country is visited by the user
      const checkResult = await db.query(
        "SELECT * FROM visited_countries WHERE country_code = $1 AND user_id = $2",
        [countryCode, currentUserId]
      );

      if (checkResult.rows.length === 0) {
        // Country not visited by the user
        res.send("You haven't visited this country yet.");
      } else {
        try {
          await db.query(
            "DELETE FROM visited_countries WHERE country_code = $1 AND user_id = $2",
            [countryCode, currentUserId]
          );
          res.redirect("/");
        } catch (err) {
          console.log(err);
          res.send("Error occurred while removing country.");
        }
      }
    }
  } catch (err) {
    console.log(err);
    res.send("Error occurred while searching for country.");
  }
});



app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
