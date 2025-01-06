import express from "express";
import axios from "axios";
import moment from "moment"; // Importing the moment library

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com/";

// Fill in your values for the 3 types of auth.
const yourUsername = "";
const yourPassword = "";
const yourAPIKey = "";
const yourBearerToken = "";

app.set('view engine', 'ejs');

app.get("/", (req, res) => {
  res.render("index", { content: "API Response." });
});

app.get("/noAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}random`);
    const { secret, emScore, username, timestamp } = response.data;
    const formattedDate = moment(new Date(timestamp)).format('MMM DD YYYY, dddd, h:mm:ss A');
    const content = `**Secret:** ${secret}\n\n**Embarrassment Score:** ${emScore}\n\n**Submitted by:** ${username}\n\n**Date:** ${formattedDate}`;
    res.render("index", { content });
  } catch (error) {
    console.error("Error fetching random secret:", error.message);
    res.render("index", { content: "Failed to fetch random secret." });
  }
});

app.get("/basicAuth", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}all`, {
      auth: {
        username: yourUsername,
        password: yourPassword
      },
      params: {
        page: 2
      }
    });

    const content = response.data.map(secret => {
      const formattedDate = moment(new Date(secret.timestamp)).format('MMM DD YYYY, dddd, h:mm:ss A');
      return `**Secret:** ${secret.secret}\n**Embarrassment Score:** ${secret.emScore}\n**Submitted by:** ${secret.username}\n**Date:** ${formattedDate}\n\n`;
    }).join('\n');

    res.render("index", { content });
  } catch (error) {
    console.error("Error fetching all secrets:", error.message);
    res.render("index", { content: "Failed to fetch secrets." });
  }
});

app.get("/apiKey", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}filter`, {
      params: {
        score: 5,
        apiKey: yourAPIKey
      }
    });

    const content = response.data.map(secret => {
      const formattedDate = moment(new Date(secret.timestamp)).format('MMM DD YYYY, dddd, h:mm:ss A');
      return `**Secret:** ${secret.secret}\n**Embarrassment Score:** ${secret.emScore}\n**Submitted by:** ${secret.username}\n**Date:** ${formattedDate}\n\n`;
    }).join('\n');

    res.render("index", { content });
  } catch (error) {
    console.error("Error filtering secrets:", error.message);
    res.render("index", { content: "Failed to filter secrets." });
  }
});

app.get("/bearerToken", async (req, res) => {
  try {
    const response = await axios.get(`${API_URL}secrets/42`, {
      headers: {
        Authorization: `Bearer ${yourBearerToken}`
      }
    });

    const { secret, emScore, username, timestamp } = response.data;
    const formattedDate = moment(new Date(timestamp)).format('MMM DD YYYY, dddd, h:mm:ss A');
    const content = `**Secret:** ${secret}\n\n**Embarrassment Score:** ${emScore}\n\n**Submitted by:** ${username}\n\n**Date:** ${formattedDate}`;
    res.render("index", { content });
  } catch (error) {
    console.error("Error fetching secret with id 42:", error.message);
    res.render("index", { content: "Failed to fetch secret." });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
