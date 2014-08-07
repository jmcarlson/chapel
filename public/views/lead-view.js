var LeadViewHeader = Backbone.View.extend({
	tagName: 'div',
	className: 'debug1 core-data col-xs-12 col-sm-12 col-md-12',
	// Put id of script section here
	// template: _.template( $('.primary').html() ),
	template: _.template('<div class="icon-inline icon-menu col-xs-12 col-sm-1 col-md-1"></div><div class="col-md-2"><%= cd01 %></div><div class="col-md-2"><%= cd02 %></div><div class="col-md-3"><%= cd03 %></div><div class="col-md-2"><%= cd04 %></div>'),

	render: function() {
		this.$el.html( this.template(this.model.toJSON()) );
		return this;
	}

});

var LeadViewDetail = Backbone.View.extend({
	tagName: 'div',
	className: 'user-data',
	template: _.template('<div class="debug2 col-xs-4 col-sm-4 col-md-2">First Name</div><div class="col-xs-8 col-sm-8 col-md-10 user-detail-data"><%= cd01 %></div>'),
	render: function() {
		this.$el.html( this.template(this.model.toJSON) );
		return this;
	}
});

var LeadListView = Backbone.View.extend({
	el: '.primary',

	// Use initialize to prime the pump
	initialize: function() {
		this.collection = new LeadList();
		this.listenTo(this.collection, 'all', this.render);
		this.collection.fetch({reset: true});
},

	render: function() {
		this.collection.forEach(function(lead) {
			this.renderList(lead);
		}, this);
	},

	renderList: function(lead) {
		var leadViewHeader = new LeadViewHeader({
			model: lead
		});
		var leadViewDetail = new LeadViewDetail({
			model: lead
		});
		console.log(leadViewDetail);
		this.$el.append(leadViewHeader.render().el);
		this.$el.append(leadViewDetail.render().el);
	}


});