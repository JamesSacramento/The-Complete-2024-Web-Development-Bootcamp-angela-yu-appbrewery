import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  try {
    const response = await axios.get("https://bored-api.appbrewery.com/random");
    const result = response.data;
    res.render("index.ejs", { data: result, error: null });
  } catch (error) {
    console.error("Failed to make request:", error.message);
    let errorMessage = "An error occurred. Please try again later.";
    if (error.response && error.response.status === 429) {
      errorMessage = "Too many requests. Please try again later.";
    } else if (error.message === 'Network Error') {
      errorMessage = 'Service is temporarily unavailable. Please try again later.';
    }
    res.render("index.ejs", {
      data: null,
      error: errorMessage,
    });
  }
});

app.post("/", async (req, res) => {
  const { type, participants } = req.body;

  try {
    const response = await axios.get("https://bored-api.appbrewery.com/filter", {
      params: {
        type: type || undefined,
        participants: participants || undefined,
      },
    });
    
    const activities = response.data;
    if (!activities.length) {
      res.render("index.ejs", { data: null, error: "No activities that match your criteria." });
    } else {
      const randomActivity = activities[Math.floor(Math.random() * activities.length)];
      res.render("index.ejs", { data: randomActivity, error: null });
    }
  } catch (error) {
    console.error("Failed to make request:", error.message);
    let errorMessage = "An error occurred. Please try again later.";
    if (error.response && error.response.status === 429) {
      errorMessage = "Too many requests. Please try again later.";
    } else if (error.response && error.response.status === 404) {
      errorMessage = "No activities that match your criteria.";
    } else if (error.message === 'Network Error') {
      errorMessage = 'Service is temporarily unavailable. Please try again later.';
    }
    res.render("index.ejs", {
      data: null,
      error: errorMessage,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
