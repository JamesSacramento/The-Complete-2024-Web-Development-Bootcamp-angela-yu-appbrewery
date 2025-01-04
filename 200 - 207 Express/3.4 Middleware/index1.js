import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Use body-parser middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

// Handle POST requests to /submit
app.post("/submit", (req, res) => {
  const formData = req.body;
  console.log(formData);
  res.send("Form submission received!");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
