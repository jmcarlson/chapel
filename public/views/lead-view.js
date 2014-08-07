var LeadView = Backbone.View.extend({
	tagName: 'div',
	// Put id of script section here
	// template: _.template( $('.primary').html() ),
	template: _.template('<div class="core-data"><%= cd01 %></div>'),

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}

});

var LeadListView = Backbone.View.extend({
	el: '.primary',

	// Use initialize to prime the pump
	initialize: function() {
		console.log('LeadListView init');
		this.collection = new LeadList();
		this.listenTo(this.collection, 'all', this.render);
		this.collection.fetch({reset: true});
},

	render: function() {
		console.log('LeadListView render');
		this.collection.forEach(function(lead) {
			this.renderList(lead);
		}, this);
	},

	renderList: function(lead) {
		var leadView = new LeadView({
			model: lead
		});
		console.log(leadView.render().el);
		this.$el.append(leadView.render().el);
	}


});