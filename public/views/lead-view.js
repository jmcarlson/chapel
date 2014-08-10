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
	//template: _.template('<div class="debug2 col-xs-4 col-sm-4 col-md-2">First Name</div><div class="col-xs-8 col-sm-8 col-md-10 user-detail-data"><%= cd01 %></div>'),
	initialize: function() {
		this.labels = new Label();
		this.labels.fetch();
	},

	render: function() {

	console.log('lead: ',this.model);
	console.log('labels: ', this.labels);
	// this.labels.forEach(function(temp) { console.log(temp); });

	// Prep handlebars template (#leadDetailTemplate)
	// 1) Retrieve template text
	var leadDetailHtml = $('#leadDetailTemplate2').html();
	//var leadDetailHtml2 = $('#leadDetailTemplate2').html();
	//console.log(leadDetailHtml2);
	// 2) Compile the template
	var createLeadDetailHtml = Handlebars.compile(leadDetailHtml);
	//console.log(createLeadDetailHtml());
	// 3) Render the template
	var newLeadDetailHtml = createLeadDetailHtml({ 
		lead: this.model.toJSON(),
		label: this.labels.toJSON()

	});
	//console.log( newLeadDetailHtml );
	// 4) Insert into DOM
	//$('#???').append(newLeadDetailHtml);

	//console.log(this);

		//this.$el.html( this.template(this.model.toJSON) );
		this.$el.html( newLeadDetailHtml );
		return this;
	}
});

var LeadListView = Backbone.View.extend({
	el: '.primary',

	// Use initialize to prime the pump
	initialize: function() {
		this.collection = new LeadList();
		//this.label = new Label();
		this.listenTo(this.collection, 'reset', this.render);
		this.collection.fetch({reset: true});
		//this.label.fetch();
		//console.log(this.label);
},

	render: function() {
		//console.log(this.collection);
		//console.log(this.label);
		this.collection.forEach(function(lead) {
			this.renderList(lead);
		}, this);
	},

	renderList: function(lead, label) {
		var leadViewHeader = new LeadViewHeader({
			model: lead
		});
		var leadViewDetail = new LeadViewDetail({
			'model': lead
			//'label': label
		});
		//console.log(leadViewDetail);
		this.$el.append(leadViewHeader.render().el);
		this.$el.append(leadViewDetail.render().el);
	}


});