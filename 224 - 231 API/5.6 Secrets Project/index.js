// 1. Import the required modules: express for server creation and axios for making HTTP requests
import express from 'express';
import axios from 'axios';

// 2. Create an instance of express and define the port number where the server will listen
const app = express();
const port = 3000;

// 3. Set the view engine to EJS so that we can use EJS templates in our project
app.set('view engine', 'ejs');

// 4. Use the public directory to serve static files like CSS, images, etc.
app.use(express.static('public'));

// 5. Define the route for the root URL ('/') of the website
// When a user accesses the home page, this function will be executed
app.get('/', async (req, res) => {
  try {
    // 6. Define the token for Bearer authentication with the API
    const token = '9cbed8b3-a431-43c8-8127-bb9e64991414';

    // 7. Make an HTTP GET request to the secrets API to fetch a random secret
    // The request includes the Authorization header with the Bearer token
    const response = await axios.get('https://secrets-api.appbrewery.com/random', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    // 8. Extract the data from the API response
    const secretData = response.data;

    // 9. Render the index.ejs template and pass the secret and user data to it
    res.render('index', { secret: secretData.secret, user: secretData.user });
  } catch (error) {
    // 10. If there is an error during the API request, log the error to the console
    console.error(error);

    // Render the index.ejs template with default values if the API request fails
    res.render('index', { secret: 'Could not fetch secret', user: 'Unknown' });
  }
});

// 11. Start the server and have it listen on the defined port
// Log a message to the console once the server is running
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
