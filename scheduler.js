var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var moment = require('moment');
var Delivery = require('./models/delivery.js');

// var controller = require('./controllers/main.js');

mongoose.connect('mongodb://localhost/chapel');
//mongodb://heroku_app27786453:<dbpassword>@ds033679.mongolab.com:33679/heroku_app27786453

var app = express();
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/admin/status', function(req, res) {
	res.send('Scheduler running (pid: ' + process.pid + ')')
})
app.get('/admin/today', function(req, res) {
	// var todayDate = moment({h:00,m:00,s:00,ms:000}).add(1,'days');
	var todayDate = moment({h:00,m:00,s:00,ms:000});
	Delivery.find({ delivery : todayDate }, function(error, results) {
		if(error) {
			console.log(error);
			res.send(error);
		}
		else {
			// res.send('Reminders to process today: ' + results.length);
			// res.send(results);
			res.render('delivery-today', {
				results: results
			})
		}
	})
});

app.get('/admin/delivery', function(req, res) {
	Delivery.find({}, function(error, results) {
		if(error) {
			console.log(error);
			res.send(error);
		}
		else {
			// res.send('Reminders to process today: ' + results.length);
			// res.send(results);
			res.render('delivery', {
				results: results
			})

		}
	})
});

// app.get('/admin/metrics', controller.metrics)

var server = app.listen(3001, function() {
	console.log('Express server listening on port ' + server.address().port);
	// Start timer
	setInterval(function() {
		console.log('[ ' + moment().format('YYYY-MM-DD HH:mm:ss') + ' ] Processing email deliveries');
	}, 30000);

});
