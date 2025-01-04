import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const today = new Date();
  const day = today.getDay();
  const isWeekend = (day === 0 || day === 6);
  const message = `Hey, It's a <strong class="${isWeekend ? 'weekend' : 'weekday'}">${isWeekend ? 'weekend' : 'weekday'}</strong>. ${
    isWeekend ? "It's time to have fun!" : "It's time to work hard!"
  }`;
  res.render('index', { message });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
