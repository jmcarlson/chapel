var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var userInputs = require('./models/contacts-user-fields.js');
var leadsData = require('./models/contacts-data-small.js');
var controller = require('./controllers/main.js');

mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/chapel');
// mongoose.connect('mongodb://chapel:Chapel2014@ds033679.mongolab.com:33679/heroku_app27786453');

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
app.get('/preferences', controller.preferences);

// Refactor controller routes
// app.get('/', controller.index)
// app.get('/api/leads', controller.api-leads)
// app.get('/api/leads/:id', controller.api-leadsById)
// app.get('/api/labels', controller.api-labels)
// app.get('/api/reminders', controller.api-reminders)
// app.get('/api/preferences', controller.api-preferences)
// app.get('/admin/status', controller.admin-status)
// app.get('/admin/metrics', controller.admin-metrics)
// app.get('/admin/reminders', controller.admin-reminders)
// app.get('/admin/reminders/today', controller.admin-reminders-today)

var server = app.listen(process.env.PORT || 3000, function() {
	console.log('Express server listening on port ' + server.address().port);
});
