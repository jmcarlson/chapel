var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var userInputs = require('./models/contacts-user-fields.js');
var leadsData = require('./models/contacts-data-small.js');
var controller = require('./controllers/main.js');

mongoose.connect('mongodb://localhost/chapel');

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/crm', controller.index);
app.post('/write', controller.write);
app.get('/crm/lead', controller.lead);
app.get('/crm/lead/:id', controller.leadById);
app.get('/crm/label', controller.label);

var server = app.listen(3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
