var mongoose = require('mongoose');

// Schema Mapping for HTML labels
// Schema-less approach using Mongoose
// 'Mixed' schema type
var Label = mongoose.model('Label', {
	any: {}
});

module.exports = Label;