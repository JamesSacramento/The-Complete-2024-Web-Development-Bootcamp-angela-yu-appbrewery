import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// Middleware function for logging
const logger = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

// Use custom logger middleware
app.use(logger);

// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST requests to /submit
app.post("/submit", (req, res) => {
  const street = req.body.street;
  const pet = req.body.pet;
  res.send(`<h1>Your band name is:</h1> <h2>${street} ${pet}</h2>`); 
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
