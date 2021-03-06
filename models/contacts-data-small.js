// Define array for basic data
var leadsData = [];

// Process contact data and user input data before the view
// example objects:
// [
//    {
//		id: objectid,
//		property: "fname",
//      title: "First Name",
//      value: "Chris"
//    },
//    {
//      title: "Hometown",
//      value: "Boulder"
//    }
// ]
//
// Data
// [ {_id, cd01, cd02, cd03, cd04, ud01, ud02, udxx} ]
// Labels
// [ {_id, cd01: 'First Name', cd02: 'Last Name', cd03: 'Email', cd04: 'Phone',
//     ud01: 'Hometown', ud02: 'Birthday'} ]
// Inputs
// [ {id: '1', name: 'ud01', type: 'text', size: '10'},
//   {id: '2', name: 'ud02', type: 'text', size: '10'} ]



// Populate test data
leadsData.push({
	id: '1', fname: 'Jon', lname: 'Carlson', email: 'jon@gmail.com', phone: '999-999-9999',
	ui2: 'May', ui1: 'Reno, NV'
});
leadsData.push({
	id: '2', fname: 'Rian', lname: 'Haag', email: 'rian@yahoo.com', phone: '777-777-7777',
	ui2: 'June', ui1: 'Clearwater, FL'
});
leadsData.push({
	id: '3', fname: 'Ben', lname: 'Crawford', email: 'bp@gmail.com', phone: '444-444-4444',
	ui2: 'March', ui1: 'Las Vegas, NV'
});
leadsData.push({
	id: '4', fname: 'Gary', lname: 'Taylor', email: 'taylor@aol.com', phone: '333-333-3333',
	ui2: 'April', ui1: 'Reno, NV'
});
leadsData.push({
	id: '5', fname: 'Mark', lname: 'Smith', email: 'mark@yahoo.com', phone: '555-555-5555',
	ui2: 'May', ui1: 'Seminole, FL'
});
leadsData.push({
	id: '6', fname: 'Rob', lname: 'Minier', email: 'robert@gmail.com', phone: '111-111-1111',
	ui2: 'April', ui1: 'Palm Harbor, FL'
});

module.exports = leadsData;

