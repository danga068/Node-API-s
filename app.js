var express = require('express');
var app = express();
var bodyParser = require('body-parser');

app.use(bodyParser.json());

var auth = require('./auth');
var products = require('./products');

app.use('/user', auth);
app.use('/product', products);

// For local server
/*var server = app.listen(3000, 'localhost', function() {
	var host = server.address().address;
	var port = server.address().port;

	console.log('Host - ', host, ' Port - ', port);
});*/

// For Heroku server
app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

module.exports = app;