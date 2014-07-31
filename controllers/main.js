var leadsData = require('../models/contacts-data-small.js');
var userInputs = require('../models/contacts-user-fields.js');
var Lead = require('../models/lead.js');

var controller = {

	index: function(req, res) {
		//res.render('index', {
		//	userInputs: userInputs,
		//	leadsData: leadsData
		//});
		// res.send('controller.index called');

		// New logic to use database
		Lead.find({}, function(error, results) {
			if(error) {
				console.log(error);
			}
			else {
				console.log(results);
				res.render('index', {
					userInputs: userInputs,
					leadsData: results
				})
			}
		})
	},

	write: function(req, res) {
		console.log(req.body);
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
				res.send(200);
			}
		})
	}
}

module.exports = controller;