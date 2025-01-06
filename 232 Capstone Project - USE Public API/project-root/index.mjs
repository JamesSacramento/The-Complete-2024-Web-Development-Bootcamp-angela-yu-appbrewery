import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index', { shortUrl: null });
});

app.post('/shorten-url', async (req, res) => {
    const longUrl = req.body.url;
    try {
        const response = await axios.post('https://cleanuri.com/api/v1/shorten', { url: longUrl });
        res.json({ shortUrl: response.data.result_url });
    } catch (error) {
        console.error('Error shortening URL:', error);
        res.json({ shortUrl: null });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
