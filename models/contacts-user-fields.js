// Inputs: text field(textbox), text area(textarea), dropdown, checkbox, radio
//
// array elements: name, type, values, size, label
//
//<input name="name" size="15" type="text" />

//<TEXTAREA NAME="Address" ROWS=3 COLS=30 ></TEXTAREA>

//<input name="color[]" type="checkbox" value="green" /> green
//<input name="color[]" type="checkbox" value="red" /> red
//<input name="color[]" type="checkbox" value="blue" /> blue

// <select id="mySelect">
//   <option>Apple</option>
//   <option>Banana</option>
//   <option>Orange</option>
//   <option>Melon</option>
// </select>

var userInputs = [];

// User input template
// userInputs.push({
// 	name: 'usrfld1', label: '', type: '', size: '', values: '[]' 
// });

userInputs.push({
	id: '1', name: 'ui1', label: 'Hometown', type: 'text', size: '10' 
});
userInputs.push({
	id: '2', name: 'ui2', label: 'Birthday', type: 'text', size: '10' 
});


