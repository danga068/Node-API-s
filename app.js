var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var auth = require('./auth');
var products = require('./products');

app.use('/user',  auth);
app.use('/product', products);

var server = app.listen(8081, 'localhost', function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Host - ', host, ' Port - ', port);
});

module.exports = app;