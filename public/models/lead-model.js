var Lead = Backbone.Model.extend({
})

var LeadList = Backbone.Collection.extend({
	model: Lead,
	url: '/crm/lead'
})