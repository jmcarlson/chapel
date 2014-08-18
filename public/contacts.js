//
// Helper functions
//

// Helper for sort by Id (default view)
var compareId = function(a,b) {
	if (a.id < b.id)
    	return -1;
	if (a.id > b.id)
 		return 1;
 	return 0;
}

// Helper for sort by last name
var compareLastName = function(a,b) {
	if (a.lname < b.lname)
    	return -1;
	if (a.lname > b.lname)
 		return 1;
 	return 0;
}

// Helper for sort by first name
var compareFirstName = function(a,b) {
	if (a.fname < b.fname)
    	return -1;
	if (a.fname > b.fname)
 		return 1;
 	return 0;
}

// Helper for incrementing user input id number (primary key)
var nextInputId = function() {
	return parseInt(_.max(userInputs, function(userInputs) { return userInputs.id }).id) + 1;
}

// Helper for incrementing contacts id number (primary key)
var nextLeadId = function() {
	return parseInt(_.max(leadsData, function(leadsData) { return leadsData.id }).id) + 1;	
}

// Helper for displaying label with user defined data fields (ui*)
var getLabel = function(str) {
	return _.findWhere(userInputs, {name: str}).label
}

//
// Render functions
//
var renderInputs = function() {

	$('#fname').val('');
	$('#lname').val('');
	$('#email').val('');
	$('#phone').val('');
	
	$('.user-form').empty();
	$('.user-form').append('<div class="icon-inline icon-emo-squint"></div>');
	for (var i = 0; i < userInputs.length; i++) {

		// Test for each input type
		switch(userInputs[i].type) {
			case "text":
				var newUserInput = $('<div class="form-group">');
				newUserInput.append(
					'<label class="sr-only" for="' + userInputs[i].name + '">' + userInputs[i].label + '</label>'
				);
				newUserInput.append(
					'<input type="' + userInputs[i].type + '" class="form-control" id="' + userInputs[i].name + '" placeholder="' + userInputs[i].label + '">'
				);
				break;
			case "checkbox":
				// var newUserInput = $('<div class="row user-checkbox">');
				var newUserInput = $('<div class="form-group col-md-12">' );
				// newUserInput.append('<div class="icon-inline icon-emo-squint"></div>');
				newUserInput.append(
					'<label class="sr-only" for="' + userInputs[i].name + '">' + userInputs[i].label + '</label>'
				);
				newUserInput.append(
					'<div class="h3"> ' + userInputs[i].label + ' </div>'
				);
				console.log(userInputs[i].values.length);
				for (var x = 0; x < userInputs[i].values.length; x++) {
					newUserInput.append(
					// '<input type="' + userInputs[i].type + '" class="form-control" id="' + userInputs[i].name + '" placeholder="' + userInputs[i].label + '">'
					'<input type="checkbox" name="check1" value="' + userInputs[i].values[x] + '"> ' + userInputs[i].values[x] + ''
					);
				};
				break;
		}

		newUserInput.appendTo('.user-form');
	}
}

// Handlebars template helper
Handlebars.registerHelper('leadFullName', function() {
	console.log("Handlebars: ", this);
	console.log("Handlebars: ", this.lead.length);
	var newHtml = $('<div id="' + this.lead._id + '" class="debug1 user-data">');
	for (prop in this.lead) {
		// console.log('prop: ', prop);
		if(prop[0] === 'c') {
			console.log('Handlebars: ' + this.label[prop] + ', ' + this.lead[prop]);
			newHtml.append('<div class="debug2 col-xs-4 col-sm-4 col-md-2 ' + prop + '">' + this.label[prop] );
			newHtml.append('<div class="debug2 col-xs-8 col-sm-8 col-md-10 user-detail-data">' + this.lead[prop] );
		}
	}
	// var newHtml = '<div>';
	// for(var x = 0; x < this.lead.length)

	// return this.label.cd01 + ": " + this.lead.cd01 + " " + this.lead.cd02;
	return newHtml;
});

// Client Jade template
var renderLeadDetailHtml = function(results) {
		var leadDetailHtml = $('#leadDetailTemplate2').html();
		var createLeadDetailHtml = Handlebars.compile(leadDetailHtml);
		var newLeadDetailHtml = createLeadDetailHtml( results );
		$('.primary').append(newLeadDetailHtml);

		jade.render(document.getElementById('primary'), 'clientlead', {
			lead: results,
			label: [] 
		})
}

// jQuery/AJAX template
var appendNewLeadHtml = function(leadData) {
	$.get('/preferences', function(prefs) {
		$.get('/crm/label/' + prefs.language, function(labelData) {
			var newHtml = $('<div id="' + leadData._id + '" class="debug1 core-data col-xs-12 col-sm-12 col-md-12">');
			newHtml.append('<div class="icon-inline icon-menu col-xs-12 col-sm-1 col-md-1">');
			newHtml.append('<div class="col-xs-12 col-sm-1 col-md-2">' + leadData.cd01);
			newHtml.append('<div class="col-xs-12 col-sm-1 col-md-2">' + leadData.cd02);
			newHtml.append('<div class="col-xs-12 col-sm-1 col-md-3">' + leadData.cd03);
			newHtml.append('<div class="col-xs-12 col-sm-1 col-md-2">' + leadData.cd04);

			var leadKeys = _.sortBy(_.keys(leadData), function(str) {
				return str;
			});

			var newHtml2 = $('<div id="' + leadData._id + '" class="debug1 user-data">');
			// for (var prop in leadData) {
			for (var i = 0; i < leadKeys.length; i++) {
				if(leadKeys[i][0] === 'c') {
					newHtml2.append('<div class="debug2 col-xs-4 col-sm-4 col-md-2 ' + leadKeys[i] + '">' + labelData[leadKeys[i]]);
					newHtml2.append('<div class="debug2 col-xs-8 col-sm-8 col-md-10 user-detail-data">' + leadData[leadKeys[i]]);
				}
			}

			newHtml.appendTo('#primary');
			newHtml2.appendTo('#primary');
		}); // labels
	}); // prefs
}

//
// Document ready; entry and event handlers
//
$(document).on('ready', function() {

	$('.user-data').hide();
	$('.user-form').hide();
	$('.inputs-form').hide();
	$('#user-fields-form').hide();
	$('.internal-eval').hide();
	$('.tools').hide();
	$('.preferences').hide();


	// Backbone entry; initial view of collection
	// v1.0 entry
	// var leadListView = new LeadListView();
	// v2.0 entry
	// var leadList = new LeadList();
	// var labels = new Label();
	// var leadListView = new LeadListView({ collection: leadList, labels: labels });
	// leadList.getResults();
	// labels.getResults();

	// Perform AJAX get call instead of Backbone fetch
	$.get('/crm/lead', function(results) {
		for (var i = 0; i < results.length; i++) {
			appendNewLeadHtml(results[i]);
		};
	})

	//
	// Event handlers
	//

	// $('.dropdown-toggle').dropdown();

	$(document).on('click', '#home', function(e) {
		// renderInputs();
		// renderData(leadsData.sort(compareId));
		$('.user-form').hide();
		$('#user-fields-form').hide();	
		$('#form-icon').attr('class', 'icon-inline icon-down-open');
		$('.tools').hide();
		$('.preferences').hide();
	});

	$(document).on('click', '#tools', function(e) {
		if( $('.tools').is(':hidden') ) {
			$('.tools').show();
		}
		else {
			$('.tools').hide();
		}

	});

	$(document).on('click', '#preferences', function(e) {
		if( $('.preferences').is(':hidden') ) {
			$('.preferences').show();
		}
		else {
			$('.preferences').hide();
		}

	});

	$('#form-icon').on('click', function(e) {
		if( $('.user-form').is(':hidden') ) {
			$('.user-form').slideDown(200);
			$('#form-icon').attr('class', 'icon-inline icon-up-open')
		}
		else {
			$('.user-form').slideUp(175);
			$('#form-icon').attr('class', 'icon-inline icon-down-open')
		}
	});

	$(document).on('mouseover', '.core-data', function(event) {
		$(this).css('background-color', '#F0F0F0');
	});

	$(document).on('mouseout', '.core-data', function(event) {
		$(this).css('background-color', 'white');
	});

	$(document).on('click', '.icon-menu', function(e) {
		if( $(this).parent().next().is(':hidden') ) {
			$(this).parent().next().slideDown(200);
		}
		else {
			$(this).parent().next().slideUp(175);
		}
	})


// MongoDB/Mongoose enabled
	$('.core-form').on('submit', function(e) {
		e.preventDefault();

		// Extract form data
		var formData = $('.core-form').find('.form-control');

		console.log(formData);

		// Create temporary object for AJAX call
		var temp = {};
	 	for (var i = 0; i < formData.length; i++) {
	 		if(formData[i].value) {
	 			temp[formData[i].id] = formData[i].value;
	 		}
	 	};

		// Add contact data to database
		$.post('/write', temp, function(results) {
			appendNewLeadHtml(results);
		});

		$('#cd01').val('').focus();
		$('#cd02').val('');
		$('#cd03').val('');
		$('#cd04').val('');

	});

	$('.preferences-form').on('submit', function(e) {
		e.preventDefault();
		var formData = $(this).find('.form-control');
		// console.log('pref-forms: ', formData);
		var temp = {};
	 	for (var i = 0; i < formData.length; i++) {
	 		if(formData[i].id === 'delivery' || formData[i].id === 'schedule') {
	 			temp[formData[i].id] = formData[i].value;
	 		}
	 		if(formData[i].selected) {
	 			temp['language'] = formData[i].value;
	 		}
	 	};
	 	temp['id'] = $('#prefs-submit').attr('data-id');

		// Add contact data to database
		$.post('/preferences', temp, function(results) {
			if(results === 'OK') {
				$.get('/crm/label/' + temp.language, function(results) {
					for (prop in results) {
						if(prop[0] === 'c') {
							$('.'+prop).text(results[prop]);
							if(prop === 'cd01' || prop === 'cd02' || prop === 'cd03' || prop === 'cd04') {
								$('#'+prop).attr('placeholder', results[prop]);
							}
						}
					}
				})
			}
			// appendNewLeadHtml(results);
		});
		// $('.preferences').hide();
	});


	$(document).on('click', '#settings', function(e) {
		if( $('#user-fields-form').is(':hidden') ) {
			$('#user-fields-form').show();
		}
		else {
			$('#user-fields-form').hide();
		}
	});

	// Sort by last name
	$(document).on('click', '#leadLastName', function(e) {
		renderData(leadsData.sort(compareLastName));
	});

	// Sort by first name
	$(document).on('click', '#leadFirstName', function(e) {
		renderData(leadsData.sort(compareFirstName));
	});

	$('#dropdown-textbox').on('click', function(e) {
		$('#inputs-form-add').show().attr('value', 'textbox');
		$('.inputs-form').hide();
		$('.inputs-textbox').show();
		$('#inputs-textbox-name').focus();
	});

	$('#dropdown-textarea').on('click', function(e) {
		$('#inputs-form-add').show().attr('value', 'textarea');
		$('.inputs-form').hide();
		$('.inputs-textarea').show();
	});
	
	$('#dropdown-checkbox').on('click', function(e) {
		$('#inputs-form-add').show().attr('value', 'checkbox');
		$('.inputs-form').hide();
		$('.inputs-checkbox').show();
	});

	$('#dropdown-radio').on('click', function(e) {
		$('#inputs-form-add').show().attr('value', 'radio');
		$('.inputs-form').hide();
		$('.inputs-radio').show();
	});

	$(document).on('click', '#inputs-form-add', function(e) {
		var inputType = $(this).attr('value');
		if(inputType === 'textbox') {
			var userInputsData = $('.inputs-textbox').find('[class=form-control]');
			userInputs.push({
				id: nextInputId().toString(), 
				name: 'ui' + nextInputId(), 
				label: userInputsData[0].value, 
				type: 'text', 
				size: '10' 
			});
		}
		else if(inputType === 'textarea') {
			var userInputsData = $('.inputs-textarea').find('[class=form-control]');
			userInputs.push({
				id: nextInputId(), 
				name: 'ui' + nextInputId(), 
				label: userInputsData[0].value
			});
		}
		else if(inputType === 'checkbox') {
			var userInputsData = $('.inputs-checkbox').find('[class=form-control]');
			var checkBoxValues = $('.checkbox-value');
			var valuesArr = [];
			for (var i = 0; i < checkBoxValues.length; i++) {
				if(checkBoxValues[i].value) {
					valuesArr.push(checkBoxValues[i].value);
				}
			};
			userInputs.push({
				id: nextInputId(), 
				name: 'ui' + nextInputId(), 
				label: userInputsData[0].value,
				type: 'checkbox',
				values: valuesArr
			});
		}
		else if(inputType === 'radio') {
			var userInputsData = $('.inputs-radio').find('[class=form-control]');
			userInputs.push({
				id: nextInputId(), 
				name: 'ui' + nextInputId(), 
				label: userInputsData[0].value
			});
		}
		else {
			console.log('Error: inputType unknown');
		}
		$('#user-fields-form').hide();
		$('.inputs-form').hide();
		$('#inputs-textbox-name').val('');
		renderInputs();
	});

	$(document).on('click', '.detail-item-delete', function(e) {
		// Retrieve data id from delete button
		var removeId = $(this).data('id').toString();

		// Filter array of data objects; ignoring the object to remove
		leadsData = leadsData.filter(function (el) { return el.id !== removeId });
		
		// Remove all elements associated with the data id (core-data, user-data classes)
		var removeClass = '.id' + removeId;
		$(removeClass).remove();
	});

	$(document).on('click', '.user-detail-data', function() {
		var dataId = $(this).data('id');
		$('.detail-item-save').show();
		var origField = $(this);
		var input = $('<input class="col-xs-12 col-sm-12 col-md-10" type="text" class="value-edit" data-id="' + dataId + '"/>');
    	$(this).after(input);
    	$(this).hide();
    	input.val($(this).text());

		input.focus();
    	input.on('blur', function(){
      		origField.text(input.val());
      		input.remove();
      		origField.show();
    	});
	})


	$(document).on('click', '.detail-item-save', function(){
			// Retrieve the data id from the save button
    		var dataId = $(this).data('id');
    		// console.log('Working with rec id: ' + dataId);

    		// Retrieve all elements with an id equal to the above
    		var temp = $(this).parent().find('.user-detail-data');
			// var temp = $(this).parent().find('[data-id=' + dataId + ']');

    		// Retrieve data object with the id equal to the above
    		var tmpObject = _.findWhere(leadsData, {id: dataId.toString()});

    		for (var i = 0; i < temp.length; i++) {
    			var tmpProp = $(temp[i]).data('prop');
    			// console.log($(temp[i]).data('prop'));
    			// console.log('dom: ' + $(temp[i]).text() );
    			// console.log('obj: ' + tmpObject[$(temp[i]).data('prop')]);
    			if(tmpObject[$(temp[i]).data('prop')] !== $(temp[i]).text()) {
    				// console.log('this changed' + $(temp[i]).data('prop') );
    				tmpObject[$(temp[i]).data('prop')] = $(temp[i]).text();
    			}
    		};
    		$(this).hide();
    		renderData(leadsData);
    });

	
});