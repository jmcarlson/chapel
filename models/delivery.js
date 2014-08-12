var mongoose = require('mongoose');

// Schema Mapping for Schedule data
//  name -> Name of schedule
//  days -> Array of reminders in days

var Delivery = mongoose.model('delivery', {
	id: mongoose.Schema.Types.ObjectId,
	lead_id: mongoose.Schema.Types.ObjectId,
	delivery: Date
});

module.exports = Delivery;