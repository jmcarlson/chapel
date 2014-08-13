var Label = Backbone.Model.extend({
	
	url: '/crm/label',
	dataValid: false,
	getResults: function(collection) {
		var self = this;
		// console.log('Label collection: ', collection);
		// console.log('Label this: ', this);
		this.fetch({
			success: function(model, response, options) {
				self.dataValid = true;
				console.log('Label fetch successful');
				self.trigger('successOnFetch');
			}
		});
	}

})

var Lead = Backbone.Model.extend({
})

// v1.0
// var LeadList = Backbone.Collection.extend({
// 	model: Lead,
// 	url: '/crm/lead'
// })

// v2.0
var LeadList = Backbone.Collection.extend({

	model: Lead,
	dataValid: false,
	url: '/crm/lead',

	getResults: function() {
		var self = this;
		this.fetch({
			reset: true,
			success: function(collection, response, options) {
				self.dataValid = true;
				console.log('LeadList fetch successful');
				// console.log(' fetch: ', collection);
				// console.log(' response: ', response);
				// console.log(' options: ', options);
				// Fetch to labels here???
				// var labels = new Label();
				// labels.getResults(self);
				// console.log('LeadList getResults labels: ', labels);
				dataFetch = 1;
				self.trigger('successOnFetch');
				
			},
			error: function(collection, response, options) {
				console.log('LeadList fetch failed');
			}
		});
	}

})