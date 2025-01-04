import express from 'express';

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', (req, res) => {
  const now = new Date();
  const currentSecond = now.getSeconds();
  const isEven = currentSecond % 2 === 0;

  const fruits = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];

  res.render('index', {
    currentSecond,
    isEven,
    fruits,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}.`);
});
