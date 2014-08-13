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
		async.series([

			// Extract label data
			function(callback) {
				Label.find({lang: 'English'}, function(error, labels) {
					if(error) {
						return callback(error);
					}
					else {
						callback(error, labels);
					}
				})
			},

			// Extract leads data
			function(callback) {
				Lead.find({}, function(error, leads) {
					if(error) {
						return callback(error);
					}
					else {
						callback(error, leads);
					}
				})
			},

			// Extract schedule data
			function(callback) {
				Schedule.find({}, function(error, schedule) {
					if(error) {
						return callback(error);
					}
					else {
						callback(error, schedule);
					}
				})
			}

		], function(error, results) {
			if(error) {
				console.log(error);
				res.send(500);
			}
			else {

				// Debug code only; remove
				// if(typeof results[0][0] === 'object') { console.log('Object!!!'); }
				//console.log(results);
				// var temp = results[0][0].toObject();
				// var temp = results[0][0];
				// console.log(temp);
				// console.log('object.lang is ', temp.lang);
				// for (xyz in temp) { console.log(xyz); }

				// console.log(results[2][0].days);
				// End of debug code

				res.render('index', {
					labelData: results[0][0],
					leadsData: results[1],
					scheduleData: results[2][0]
				})
				// res.send(200);
			}
		})
	}, // End of 'index' controller

	write: function(req, res) {
		// console.log(req.body);

		// Add new lead
		var lead = new Lead();
		if(req.body.cd01) { lead.cd01 = req.body.cd01; }
		if(req.body.cd02) { lead.cd02 = req.body.cd02; }
		if(req.body.cd03) { lead.cd03 = req.body.cd03; }
		if(req.body.cd04) { lead.cd04 = req.body.cd04; }
		lead.save(function(error, lead_results) {
			if(error) {
				console.log(error);
				res.send(500);
			}
			else {
				// console.log('results: ', lead_results);
						// Extract default schedule to setup email delivery schedule
						Preference.find({name: 'schedule'}, function(error, pref_results) {
							if(error) {
								console.log(error);
							}
							else {
								// Add future delivery dates to database
								var schedule = pref_results[0].value.split(',');
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
										else {
											console.log('Added email schedule: ', delivery);
										}
									})
								};
							}
						});

				res.send(200, lead_results);
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
		console.log(req.params.id);
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
		Label.findOne({lang: 'English'}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				res.send(200, results);
			}
		})
	}, // end of 'label' controller


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
		res.send(200);
	} // end of 'preferences' controller

}

module.exports = controller;