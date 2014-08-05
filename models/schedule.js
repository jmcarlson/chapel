var mongoose = require('mongoose');

// Schema Mapping for Schedule data
//  name -> Name of schedule
//  days -> Array of reminders in days

var Schedule = mongoose.model('Schedule', {
	id: mongoose.Schema.Types.ObjectId,
	name: String,
	days: []
});

module.exports = Schedule;