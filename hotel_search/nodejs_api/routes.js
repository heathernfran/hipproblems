const express = require('express');
const app = express();

const getData = require('./index.js');

app.get('/hotels/search/', (req, res) => {
  res.render('index.html')
  res.send('test get request')
});
