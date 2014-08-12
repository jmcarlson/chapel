var mongoose = require('mongoose');

// Schema Mapping for Schedule data
//  name -> Name of schedule
//  days -> Array of reminders in days

var Preference = mongoose.model('Preference', {
	id: mongoose.Schema.Types.ObjectId,
	name: String,
	value: String
});

module.exports = Preference;