const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const indexRoutes = require('./routes/index');
const postRoutes = require('./routes/posts');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', indexRoutes);
app.use('/posts', postRoutes);

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
