import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import morgan from "morgan";

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

// Use morgan for logging
app.use(morgan('dev'));

// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle POST requests to /check
app.post("/check", (req, res) => {
  const password = req.body.password;
  if (password === "ILoveProgramming") {
    res.sendFile(path.join(__dirname, 'public', 'secret.html'));
  } else {
    res.redirect("/");
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
