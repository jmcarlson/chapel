var async = require('async');
var moment = require('moment');
var leadsData = require('../models/contacts-data-small.js');
var userInputs = require('../models/contacts-user-fields.js');
var Lead = require('../models/lead.js');
var Label = require('../models/label.js');
var Schedule = require('../models/schedule.js');
var Delivery = require('../models/delivery.js');
var Preference = require('../models/preference.js');

var controller = {

	index: function(req, res) {

		// Async.series mechanism for database
		// queries; leads and label data
		async.waterfall([

			// Pull preference data
			function(callback) {
				Preference.findOne({}, function(error, prefs) {
					if(error) {
						console.log(error);
					}
					else {
						console.log('prefs: ', prefs);
						callback(error, prefs);
					}
				})
			},

			// Extract label data
			function(prefs, callback) {
				console.log('callback prefs: ', prefs);
				Label.findOne({lang: prefs.language}, function(error, labels) {
					if(error) {
						return callback(error);
					}
					else {
						callback(error, prefs, labels);
					}
				})
			},

			// test
			function(prefs, labels, callback) {
				console.log('test callback: ', prefs);
				console.log('test callback: ', labels);
				res.render('index', {
					prefsData: prefs.toJSON(),
					labelData: labels.toJSON()
				})
				callback(null, 'done');
			}

		], function(error, results) {
			if(error) {
				console.log(error);
				res.send(500);
			}
			// else {
				// console.log('index results: ', results);
				// res.send(200);
			// }
		})
	}, // End of 'index' controller

	write: function(req, res) {
		Preference.findOne({}, function(error, pref_results) {
			if(error) {
				console.log(error);
			}
			else {
				// Add future delivery dates to database
				var schedule = pref_results.schedule.split(',');
										// Add new lead
				var lead = new Lead();
				if(req.body.cd01) { lead.cd01 = req.body.cd01; }
				if(req.body.cd02) { lead.cd02 = req.body.cd02; }
				if(req.body.cd03) { lead.cd03 = req.body.cd03; }
				if(req.body.cd04) { lead.cd04 = req.body.cd04; }
				lead.cd07 = pref_results.schedule;
				lead.save(function(error, lead_results) {
					if(error) {
						console.log(error);
						res.send(500);
					}
					else {
						for (var i = 0; i < schedule.length; i++) {
							var newDate = moment({h:00,m:00,s:00,ms:000}).add(schedule[i],'days');
							var delivery = new Delivery();
							delivery.lead_id = lead_results._id;
							delivery.delivery = newDate;
							delivery.status = 'Waiting';
							delivery.save(function(error, delivery_results) {
								if(error) {
									console.log(error);
								}
								// else {
								// 	console.log('Added email schedule: ', delivery);
								// }
							})
						};
						res.send(200, lead_results);		
					}
				});
			}
		})
	}, // End of 'write' controller

	lead: function(req, res) {
		Lead.find({}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				res.send(200, results);
			}
		})
	}, // end of 'lead' controller

	leadById: function(req, res) {
		Lead.find({_id: req.params.id}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				res.send(200, results);
			}
		})
	}, // end of 'lead' controller

	label: function(req, res) {
		Label.find({}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				res.send(200, results);
			}
		})
	}, // end of 'label' controller

	labelByName: function(req, res) {
		Label.findOne({lang: req.params.name}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				res.send(200, results);
			}
		})
	}, // end of 'lead' controller

	delivery: function(req, res) {
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
	}, // end of 'delivery' controller

	today: function(req, res) {
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
	}, // end of 'today' controller

	preferences: function(req, res) {
		Preference.findOne({}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				res.send(200, results);
			}
		})

	}, // end of 'preferences' controller

	preferences_post: function(req, res) {
		// Add new lead
		// var preference = new Preference();
		if(req.body.id) { var dataId = req.body.id; }
		if(req.body.delivery) { var del = req.body.delivery; }
		if(req.body.schedule) { var sched = req.body.schedule; }
		if(req.body.language) { var lang = req.body.language; }

		Preference.update({_id: dataId}, {delivery: del, schedule: sched, language: lang}, function(error, preference_results) {
			if(error) {
				res.send(500);
			}
			else {
				res.send(200);
			}
		});
	} // end of 'preferences_post' controller

}

module.exports = controller;