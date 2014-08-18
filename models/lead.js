var mongoose = require('mongoose');

// Schema Mapping for Core Data(cd)
//  cd01 -> First Name
//  cd02 -> Last Name
//  cd03 -> Email
//  cd04 -> Phone
//  cd05 -> Create date
//  cd06 -> Last Update date

var Lead = mongoose.model('Lead', {
	id: mongoose.Schema.Types.ObjectId,
	cd01: { type: String, default: '' },
	cd02: { type: String, default: '' },
	cd03: { type: String, default: '' },
	cd04: { type: String, default: '' },
	cd05: { type: Date, default: Date.now },
	cd06: { type: Date, default: Date.now },
	cd07: { type: [],},
	cd08: { type: String},
	cd09: { type: String},
	cd10: { type: String},
	cd11: { type: String}
});

module.exports = Lead;