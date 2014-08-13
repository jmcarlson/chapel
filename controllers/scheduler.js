var async = require('async');
var moment = require('moment');
var Lead = require('../models/lead.js');
var Label = require('../models/label.js');
var Schedule = require('../models/schedule.js');
var Delivery = require('../models/delivery.js');
var Preference = require('../models/preference.js');

var	sendgrid_username = process.env.SENDGRID_USERNAME || 'app27786453@heroku.com';
var sendgrid_password = process.env.SENDGRID_PASSWORD || 'aq65tfk9';
var sendgrid = require('sendgrid')(sendgrid_username, sendgrid_password);

var scheduler = {

	test: function() {
		console.log('Scheduler.test called');
	}, // end of 'test' controller

	process2: function() {
		// Create variable with today's date
		var todayDate = moment({h:00,m:00,s:00,ms:000});
		// var todayDate = moment();

		// Process outbound emails
		async.waterfall([
			// Check for emails to deliver
			function(callback) {
				Delivery.find({delivery: todayDate}, function(error, emails) {
					if(error) {
						console.log(error);
					}
					else {
						console.log('Waterfall Delivery: ', emails);
						callback(null, emails);
					}
				})
			},
			// If so, lookup lead info
			function(emails, callback) {
				var temp = [{name: 'test'}];
				for (var i = 0; i < emails.length; i++) {
					var temp2 = emails[i];
					Lead.findOne({_id: emails[i].lead_id}, function(error, lead) {
						if(error) {
							console.log(error);
						}
						else {
							// callback(null, 'done');
							console.log('Waterfall Lead: ', lead);
							console.log('jmc2 ', temp2);
							console.log('jmc ', emails);

						}
					});
				}
				callback(null, 'done');
				// var temp = {name: 'test'};
				// console.log('Waterfall: ', emails);
				// callback(null, emails, temp);
			}
			// Extract delivery email(to address)
			// function(deliveries, temp, callback) {
			// 	// callback(null, deliveries, deliveryEmail);
			// 	console.log('Waterfall: ', deliveries);
			// 	console.log('Waterfall: ', temp);
			// 	callback(null, 'done');
			// }
			// // Send email (sendGrid)
			// function(deliveries, deliveryEmail, callback) {
			// 	callback(null, deliveries);
			// },
			// // Update email delivery info
			// function(deliveries, callback) {
			// 	callback(null, 'done')
			// }
		], function(error, results) {
			(error) ? console.log(error) : console.log(results);
		});
	},

	process: function() {
		var todayDate = moment({h:00,m:00,s:00,ms:000});
		// var todayDate = moment();
		Delivery.find({ delivery : todayDate }, function(error, deliveries) {
			if(error) {
				console.log(error);
			}
			else {
				Preference.findOne({name: 'delivery'}, function(error, toEmail) {
					if(error) {
						console.log(error);
					}
					else {
						console.log(toEmail.value)
						// Extract lead information for email delivery
						for (var i = 0; i < deliveries.length; i++) {
							console.log('Found lead_id to process: ', deliveries[i].lead_id);
							Lead.findOne({_id: deliveries[i].lead_id}, function(error, lead) {
								if(error) {
									console.log(error);
								}
								else {
									console.log('Found lead(s): ', lead);
									var email = {
										to: toEmail.value,
										from: 'system@refactoru.com',
										subject: 'Follow up required: ' + lead.cd01 + ' ' + lead.cd02 + ' ' + lead.cd03 + ' ' + lead.cd04,
										text: lead.cd01
									}
									console.log('Email: ', email);
									// console.log(process.deliveries[i].id);
									// Delivery email
									// sendgrid.send(email, function(error, json) {
									// 	if(error) { console.log(error); }
									// 	else { console.log(json); }
									// })
								}
							})
						};
					}
				});
			}
		})
	} // end of 'process' controller

}

module.exports = scheduler;