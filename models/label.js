var mongoose = require('mongoose');

// Schema Mapping for HTML labels
//   key -> property name of Lead, Input(cd01, ui01, etc)
//   value -> value/label
// var Label = mongoose.model('Label', {
// 	id: mongoose.Schema.Types.ObjectId,
// 	key: String,
// 	value: String
// });

// Schema-less approach using Mongoose
// 'Mixed' schema type
var Label = mongoose.model('Label', {
	any: {}
});

module.exports = Label;