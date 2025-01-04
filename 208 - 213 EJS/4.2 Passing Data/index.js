import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 

app.get("/", (req, res) => {
  res.render("index", { nameLength: null, message: null });
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
