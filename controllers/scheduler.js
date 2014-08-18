var async = require('async');
var moment = require('moment');
var _ = require('underscore');
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

	createEmail: function(lead, toEmail) {
		var newEmail = {
			to: toEmail,
			from: 'system@refactoru.com',
			subject: 'Follow up required: ' + lead.cd01 + ' ' + lead.cd02 + ' ' + lead.cd03 + ' ' + lead.cd04,
			text: lead.cd03 + '<br>' + lead.cd04
			};
		return newEmail;
	},

	process2: function() {
		var todayDate = moment({h:00,m:00,s:00,ms:000});
		var emails = [];
		var leads = [];
		var toEmail;
		// var todayDate = moment();

		async.series([
			function(callback) {
				Delivery.find({delivery: todayDate, status: 'Waiting'}, function(error, results) {
					if(error) {
						return callback(error);
					}
					else {
						if(results.length === 0) {
							console.log('[ ' + moment().format('YYYY/MM/DD HH:mm:ss') + ' ] No email reminders to process');
							return callback(error);
						}
						else {
							for (var i = 0; i < results.length; i++) {
								emails.push(results[i]);
							}
							callback(error, results);
						}
					}
				})
			},
			function(callback) {
				for (var i = 0; i < emails.length; i++) {
					Lead.findOne({_id: emails[i].lead_id}, function(error, results) {
						if(error) {
							return callback(error);
						}
						else {
							leads.push(results);
						}
					});
				}
				callback();
			},
			function(callback) {
				Preference.findOne({}, function(error, results) {
					if(error) {
						return callback(error);
					}
					else {
						toEmail = results.delivery;
						callback(error, results);
					}
				})
			}

		], function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				// Loop through leads and perform async.series
				// to 1) send email  2) update delivery entry
				for (var i = 0; i < leads.length; i++) {

					var tmpLead = leads[i];
					var tmpLeadId = tmpLead._id.toString();
					var tmpDelivery = _.filter(emails, function(email) {
						return email.lead_id.toString() === tmpLeadId;
					});
					var tmpDeliveryId = tmpDelivery[0]._id;

					var email = scheduler.createEmail(tmpLead, toEmail);

					// debug messages
					if(0) {
						console.log('======== DEBUG s ========');
						console.log('Found email reminders to process: ', tmpDelivery);
						console.log('Processing email for lead: ', tmpLead);
						console.log('Reminder id: ', tmpDeliveryId);
						console.log('Lead id: ', tmpLeadId);
						console.log('Email template: ', email);
						console.log('======== DEBUG e ========');
					}

					// Define/invoke iffe to eliminate variable reference issue
					// with callbacks
					(function(tmpDeliveryId) { 
						sendgrid.send(email, function(error, rc) {
							if(error) { 
								console.log(error);
							}
							else { 
								console.log('sendGrid status: ', rc);
								Delivery.update({_id: tmpDeliveryId}, {status: 'Completed'}, function(error, affected, rc) {
									if(error) {
										console.log(error);
									}
									else {
										console.log('MongoDB update: ', rc);
									}
								});
							}
						});
					})(tmpDeliveryId);

				}; // end of for loop	
			}
			// (error) ? console.log(error) : console.log(results);
		});  // end of async

	},

	process: function() {
		var todayDate = moment({h:00,m:00,s:00,ms:000});
		var temp1 = [];
		var temp2 = [];
		// var todayDate = moment();
		Delivery.find({ delivery : todayDate }, function(error, deliveries) {
			if(error) {
				console.log(error);
			}
			else {
				temp1.push(deliveries);
				Preference.findOne({name: 'delivery'}, function(error, toEmail) {
					if(error) {
						console.log(error);
					}
					else {
						// console.log(toEmail.value)
						// Extract lead information for email delivery
						for (var i = 0; i < deliveries.length; i++) {
							// console.log('Found lead_id to process: ', deliveries[i].lead_id);
							Lead.findOne({_id: deliveries[i].lead_id}, function(error, lead) {
								if(error) {
									console.log(error);
								}
								else {
									// console.log('Found lead(s): ', lead);
									temp2.push(lead);
									var email = {
										to: toEmail.value,
										from: 'system@refactoru.com',
										subject: 'Follow up required: ' + lead.cd01 + ' ' + lead.cd02 + ' ' + lead.cd03 + ' ' + lead.cd04,
										text: lead.cd01
									}
									console.log('Email: ', email);
									console.log('temp1: ', temp1);
									console.log('temp2: ', temp2);
									// console.log('Delivery id: ', process.deliveries[i].id);
									// console.log('date: ', moment(todayDate));
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