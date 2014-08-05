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

	//
	// Event handlers
	//
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
		var formData = $('.form-group').find('[class=form-control]');

		// Create temporary object for AJAX call
		var temp = {};
	 	for (var i = 0; i < formData.length; i++) {
	 		if(formData[i].value) {
	 			temp[formData[i].id] = formData[i].value;
	 		}
	 	};
		console.log(temp);

		// Add contact data to database
		$.post('/write', temp, function() {

		});
	});

// Old version; Client only prototype
	// $('.core-form').on('submit', function(e) {
	// 	e.preventDefault();

	// 	var coreFormData = $('.core-form').find('[class=form-control]');

	// 	var testFormData3 = $('.form-group').find('[class=form-control]');
	// 	leadsData.push({id: nextLeadId().toString()});
	// 	var temp = _.last(leadsData);

	// 	for (var i = 0; i < testFormData3.length; i++) {
	// 		if(testFormData3[i].value) {
	// 			temp[testFormData3[i].id] = testFormData3[i].value;
	// 		}
	// 	};
	// 	renderInputs();
	// 	renderData(leadsData);
	// });

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