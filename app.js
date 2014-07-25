var express = require('express');
var bodyParser = require('body-parser');
var userInputs = require('./models/contacts-user-fields.js');
var leadsData = require('./models/contacts-data-small.js');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/crm', function(req, res) {
	res.render('index', {
		userInputs: userInputs,
		leadsData: leadsData
	});
});

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
