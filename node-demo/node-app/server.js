const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const app = express();
const users = require('./routes/api/user');
const profile = require('./routes/api/profile');
const db = require('./config/keys').mongoURI;
const port = process.env.PORT || 5000;

// 使用中间件允许跨域
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS');
  next();
});

// 使用bodyParser
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);
app.use(bodyParser.json());

// passport的初始化
app.use(passport.initialize());

// 配置passport
require('./config/passport')(passport);

app.use('/api/users', users);
app.use('/api/profile', profile);

// 连接数据库
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
  res.send('Hello Word');
});

app.listen(port, () => {
  console.log(`Server is runing on port ${port}`);
});
