var leadsData = require('../models/contacts-data-small.js');
var userInputs = require('../models/contacts-user-fields.js');

var controller = {

	index: function(req, res) {
		res.render('index', {
			userInputs: userInputs,
			leadsData: leadsData
		});
		// res.send('controller.index called');
	}
}

module.exports = controller;