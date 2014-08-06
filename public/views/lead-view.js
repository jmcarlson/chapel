var LeadView = Backbone.View.extend({

	template: _.template('<div><%= cd01 %></div>'),

	render: function() {
		// var leadsData = $('<div>').text('cd01');
		// var leadsData = $('<div>').text(this.model.get('cd01'));
		var attributes = this.model.get('cd01');
		this.$el.html(this.template(attributes));
		// this.$el.empty().append(leadsData);
	}

})