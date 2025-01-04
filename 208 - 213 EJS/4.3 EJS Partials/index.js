import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

// Convert the current module URL to a path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Set up static files to be served from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Set the view engine to EJS
app.set('view engine', 'ejs');

// Render the home page
app.get("/", (req, res) => {
  res.render("index", { nameLength: null, message: null });
});

// Render the about page
app.get("/about", (req, res) => {
  res.render("about");
});

// Render the contact page
app.get("/contact", (req, res) => {
  res.render("contact");
});

app.post("/", (req, res) => {
  const fName = req.body.fName.trim();
  const lName = req.body.lName.trim();
  
  if (!fName && !lName) {
    res.render("index", { nameLength: null, message: "Please enter at least one name." });
  } else {
    const nameLength = fName.length + lName.length;
    res.render("index", { nameLength: nameLength, message: null });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
