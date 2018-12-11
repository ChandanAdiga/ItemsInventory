var express = require('express');
const bodyParser = require('body-parser');

var app = express();

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

// parse requests of content-type - application/json
app.use(bodyParser.json())

require('./routes/item.routes.js')(app);

module.exports = app;
