import express from "express";
import bodyParser from "body-parser";
import pkg from "pg"; // Corrected import

const { Client } = pkg;

const app = express();
const port = 3000;

// PostgreSQL client setup
const client = new Client({
  user: ,
  host: ,
  database: ,
  password: ,
  port: 5432,
});

client.connect();

let totalCorrect = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

let currentQuestion = {};

// GET home page
app.get("/", async (req, res) => {
  totalCorrect = 0;
  await nextQuestion();
  console.log(currentQuestion);
  res.render("index", { question: currentQuestion, totalScore: 0, wasCorrect: null });
});

// POST a new post
app.post("/submit", async (req, res) => {
  let answer = normalizeInput(req.body.answer.trim().toLowerCase());
  let isCorrect = false;

  if (!currentQuestion.capital || normalizeInput(currentQuestion.capital.toLowerCase()) === answer) {
    totalCorrect++;
    console.log(totalCorrect);
    isCorrect = true;
  }

  await nextQuestion();
  res.render("index", {
    question: currentQuestion,
    wasCorrect: isCorrect,
    totalScore: totalCorrect,
  });
});

function normalizeInput(input) {
  return input
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Normalize and remove diacritics
    .replace(/city|d\.c\./gi, "") // Remove "city" and "D.C."
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .trim(); // Trim leading and trailing spaces
}

async function nextQuestion() {
  const result = await client.query(
    "SELECT country, capital FROM capitals ORDER BY RANDOM() LIMIT 1"
  );
  currentQuestion = result.rows[0];
}

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
