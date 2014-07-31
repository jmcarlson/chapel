var mongoose = require('mongoose');

// Schema Mapping for Core Data(cd)
//  cd01 -> First Name
//  cd02 -> Last Name
//  cd03 -> Email
//  cd04 -> Phone
//  cd05 -> Create date
//  cd06 -> Update date

var Lead = mongoose.model('Lead', {
	id: mongoose.Schema.Types.ObjectId,
	cd01: String,
	cd02: String,
	cd03: String,
	cd04: String,
	cd05: { type: Date, default: Date.now },
	cd06: Date
});

module.exports = Lead;