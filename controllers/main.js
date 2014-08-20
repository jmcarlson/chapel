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
				// console.log('callback prefs: ', prefs);
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
				// console.log('test callback: ', prefs);
				// console.log('test callback: ', labels);
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
				if(req.body.cd08) { lead.cd08 = req.body.cd08; }
				if(req.body.cd09) { lead.cd09 = req.body.cd09; }
				if(req.body.cd10) { lead.cd10 = req.body.cd10; }
				if(req.body.cd11) { lead.cd11 = req.body.cd11; }
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
	}, // end of 'preferences_post' controller

	leadRemoveById: function(req, res) {
		// console.log('Removing: ', req.body.id);
		Delivery.remove({lead_id: req.body.id}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				Lead.remove({_id: req.body.id}, function(error, results) {
					if(error) {
						console.log(error);
					}
					else {
						res.send(200);
					}
				})
			}
		})
	},  // end of 'leadRemoveById'

	leadUpdateById: function(req, res) {

		// console.log('leadUpdateById: ', req.params.id);
		// console.log('leadUpdateById: ', req.body);

		Lead.update({_id: req.params.id}, req.body, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				console.log('leadUpdateById results: ', results);
			}
		});

	},  // end of 'leadRemoveById' controller

	csvgen: function(req, res) {

		var temp = "New Contactsergio9439@att.net7757718382is";

		console.log('t1 ', temp.indexOf('New Contacts'));

		// Lead.find({}, function(error, results) {
		// 	if(error) {
		// 		console.log(error);
		// 	}
		// 	else {
		// 		// console.log(results);
		// 		for (var i = 0; i < results.length; i++) {
		// 			// console.log(results[i]);
		// 			console.log(results[i].cd01+','+results[i].cd02+','+results[i].cd03+','+results[i].cd04);
		// 		};
		// 		res.send(results);
		// 	}
		// });

	},  // end of 'csvgen' controller

	sendgrid: function(req, res) {

		// console.log('sendGrid: ', req.body.text);
		// Parse out email and phone
		var temp = req.body.text;
		var tempx = req.body.text;
		var temp2 = temp.split('New Contact');
		var temp3 = temp2[1].split('is');
		var emailRegex = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;
		var email = emailRegex.exec(temp3[0]);
		// console.log('email: ', email);

		// console.log(tempx);
		// var temp6 = tempx.split('You can reach me at: ');
		// console.log(temp6);
		// var temp7 = temp6.split('Respond');
		// console.log('new phone: ', temp7);
		var phone = temp3[0].replace(email[0],'').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
		// Parse out property notes
		// console.log('req.body.text', req.body.text);
		// console.log('tempx: ', tempx);
		// Add robust email support here;
		//  - forwarding out of gmail will add '\r\n' for spaces
		//  - forwarding directly will not have
		if(tempx.indexOf('For\r\nSale: ') === -1) {
			console.log('zz1');
			var temp4 = tempx.split('For\r\nSale: ');
		}
		else {
			console.log('zz1');
			var temp4 = tempx.split('For Sale: ');
		}
		console.log('xx1', tempx.indexOf('For\r\nSale: '));
		console.log('xx2', tempx.indexOf('For Sale: '));
		// var temp4 = tempx.split('For\r\nSale: ');
		// console.log('temp4: ', temp4);
		var temp5 = temp4[1].split('Listed by:');
		// console.log('Notes: ',temp5[0]);


		Preference.findOne({}, function(error, pref_results) {
			if(error) {
				console.log(error);
				res.status(500).end();
			}
			else {
				// Add future delivery dates to database
				var schedule = pref_results.schedule.split(',');
										// Add new lead
				var lead = new Lead();
				lead.cd01 = 'None';
				lead.cd02 = 'None';
				lead.cd03 = email[0];
				lead.cd04 = phone;
				lead.cd07 = schedule;
				lead.cd08 = 'Web advertisement';
				lead.cd09 = 'Zillow lead';
				lead.cd10 = 'No';
				lead.cd11 = temp5[0];
				// lead.cd11= 'None';

				// console.log(lead);

				lead.save(function(error, lead_results) {
					if(error) {
						console.log(error);
						res.status(500).end();
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

						res.status(200).end();
					}
				});
			}
		});


	} // end of 'sendgrid' controller

}

module.exports = controller;