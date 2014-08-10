var async = require('async');
var leadsData = require('../models/contacts-data-small.js');
var userInputs = require('../models/contacts-user-fields.js');
var Lead = require('../models/lead.js');
var Label = require('../models/label.js');
var Schedule = require('../models/schedule.js');

var controller = {

	index: function(req, res) {

		// Async.series mechanism for database
		// queries; leads and label data
		async.series([

			// Extract label data
			function(callback) {
				Label.find({lang: 'spa'}, function(error, labels) {
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
					labelData: results[0][0].toObject(),
					leadsData: results[1],
					scheduleData: results[2][0]
				})
			}
		})
	}, // End of 'index' controller

	write: function(req, res) {
		// console.log(req.body);
		var lead = new Lead();
		if(req.body.cd01) { lead.cd01 = req.body.cd01; }
		if(req.body.cd02) { lead.cd02 = req.body.cd02; }
		if(req.body.cd03) { lead.cd03 = req.body.cd03; }
		if(req.body.cd04) { lead.cd04 = req.body.cd04; }
		lead.save(function(error, results) {
			if(error) {
				console.log(error);
				res.send(500);
			}
			else {
				console.log('Contact add successful');
				//console.log('results: ', results);
				res.send(200, results);
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
		Label.find({lang: 'spa'}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				res.send(200, results);
			}
		})
	} // end of 'label' controller

}

module.exports = controller;