/*
*
* OUR CUSTOM JAVASCRIPT SHOULD BE ADDED HERE
*
*/


const timers = [];
const timerIntervals = [];

const queueList = {
	"STUDYSmarter":[],
	"Librarian":[],
	"In Session":[]
};

const addToQueueList = async (data) => {
	// This function adds the data (object - of the student details) to the specified queueList
	// And rerenders the table
	
	try{
		const response = await fetch("add_entry", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		const dataResponse = await response.json()
		queueList[data.queue].push(dataResponse)
		
		timers[dataResponse.id] = 0;
		timerIntervals[dataResponse.id] = setInterval(setTime, 1000, dataResponse.id);
		rerenderTables()
	}
	catch(error){
		// There's an error
		console.log(error)
	}
	
}

const moveToSessionOrUndo = async(data) => {
	// This function move the data (object - of the student details) to the in Session table
	// or Move the data from in Session table back to waiting queue table
	// And rerenders the table
	try{
		const response = await fetch(`/update_entry/${data.id}`, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		const dataResponse = await response.json()		
		if (dataResponse.status == "In Session")
		{	
			const index = queueList[dataResponse.queue].findIndex((element) => element.id == dataResponse.id)
			// pop the data from waiting queue
			queueList[dataResponse.queue].splice(index, 1)
			queueList['In Session'].push(dataResponse)
			clearInterval(timerIntervals[dataResponse.id]);
			timers[dataResponse.id] = 0;
			timerIntervals[dataResponse.id] = setInterval(setTime, 1000, dataResponse.id);
		}
		else
		{	
			const index = queueList['In Session'].findIndex((element) => element.id == dataResponse.id)
			// pop the data from in Session queue
			queueList['In Session'].splice(index, 1)
			queueList[dataResponse.queue].push(dataResponse)
			clearInterval(timerIntervals[dataResponse.id]);
			const timeDifferenceMiliseconds = (new Date()).getTime() - (new Date(dataResponse.enterQueueTime)).getTime()
			timers[dataResponse.id] = Math.round(timeDifferenceMiliseconds / 1000);
			timerIntervals[dataResponse.id] = setInterval(setTime, 1000, dataResponse.id);
		}
	
		rerenderTables()
	}
	catch(error){
		// There's an error
		console.log(error)
	}
}

const terminateSession = async(data) => {
	// This function update the status data 
	// And rerenders the table
	try{
		const response = await fetch("/update_entry/" + data.id, {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		const dataResponse = await response.json()
		if (dataResponse.status == "Ended"){
			const index = queueList[dataResponse.queue].findIndex((element) => element.id == dataResponse.id)
			// pop the data from current queue
			queueList[dataResponse.queue].splice(index, 1)
		}
		else{
			const index = queueList["In Session"].findIndex((element) => element.id == dataResponse.id)
			// pop the data from current queue
			queueList["In Session"].splice(index, 1)
		}
		timers[dataResponse.id] = 0;
		clearInterval(timerIntervals[dataResponse.id]);
		rerenderTables()
	}
	catch(error){
		// There's an error
		console.log(error)
	}
}

function validateUserInput(data) {
	// Check student name
	if (data.studentName.length > 50) {
		alert("'Student Name' field should is too long.");
		return false;
	}
	if (!/^([^0-9]*)$/.test(data.studentName)) {
		alert("Please do not use numeric values in 'Student Name' field.");
		return false;
	}


	// Check student number
	if (data.studentNumber.length != 8) {
		alert("'Student Number' field should be an 8 digit number.");
		return false;
	}
	if (!/^([0-9]*)$/.test(data.studentNumber)) {
		alert("Please only numeric values in 'Student Number' field.");
		return false;
	}
	
	// Check unit code
	if (data.unitCode.length != 8 || !/([A-Za-z]){4}([0-9]){4}$/.test(data.unitCode)) {
		alert("'Unit Code' field should be 4 alphabetic characters followed by 4 numerics characters.");
		return false;
	}

	// Check enquiry type
	if (!/^([^0-9]*)$/.test(data.enquiry)) {
		alert("Please do not use numeric values in 'Enquiry Type' field.");
		return false;
	}	

	// All inputs are fine
	return true;
}

const rerenderTables = () => {
	const dataTablesToRerender = [
		{
			"tableSelector":"#studysmarterDataTable",
			"queueName":"STUDYSmarter"
		},
		{
			"tableSelector":"#librarianDataTable",
			"queueName":"Librarian"
		},
	]

	dataTablesToRerender.forEach(({tableSelector,queueName})=>{
		const table = document.querySelector(tableSelector);
		table.innerHTML = queueList[queueName].map(element => `<tr id="${element.id}" class="initialTime">
		<td>${element.studentName}</td>
		<td>${element.studentNumber}</td>
		<td>${element.unitCode}</td>
		<td class="text-right">${element.enquiry}</td>
		<td class="text-right"><label id="minutes${element.id}">00</label><label id="colon">:</label><label id="seconds${element.id}">00</label></td>
		<td class="td-actions text-right">
		<button type="button" rel="tooltip" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="testing111" onclick="addSessionToTeam('${element.id}','add')(this)"><i class="material-icons">how_to_reg</i></button>
		<button type="button" rel="tooltip" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="testing2222" onclick="if(confirm('Are you sure to remove ${element.studentName}?')) terminateRow('${element.id}','delete')(this)"><i class="material-icons">close</i></button></td>
		</tr>`).join("")
	})
	const inSessiontable = document.querySelector("#inSessionDataTable");
	inSessiontable.innerHTML = queueList["In Session"].map(element => `<tr id="${element.id}" class="initialTime">
	<td>${element.queue}</td>
	<td>${element.studentName}</td>
	<td>${element.studentNumber}</td>
	<td>${element.unitCode}</td>
	<td class="text-right">${element.enquiry}</td>
	<td class="text-right"><label id="minutes${element.id}">00</label><label id="colon">:</label><label id="seconds${element.id}">00</label></td>
	<td class="td-actions text-right">
	<button type="button" rel="tooltip" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="testing3333" onclick="terminateRow('${element.id}','finish')(this)"><i class="material-icons">how_to_reg</i></button>
	<button type="button" rel="tooltip" class="btn btn-undo" data-toggle="tooltip" data-placement="top" title="testing444" onclick="if(confirm('Move ${element.studentName} back to waiting queue?')) addSessionToTeam('${element.id}','undo')(this)"><i class="material-icons">undo</i></button>
	</tr>`).join("")
}

function showAddToQueue() {
	$('#addToQueue').css('display', 'block');
}

function hideAddToQueueForm() {
	document.getElementById('addToQueueForm').reset();
	$('#addToQueue').css('display', 'none');
}

$('#addToQueueForm').submit(function (e) {
	// This is the function that executes on the submission of the Student Data
	e.preventDefault();

	const studentName = document.getElementById('studentName').value;
	const studentNumber = document.getElementById('studentNumber').value;
	const unitCode = document.getElementById('unitCode').value;
	const queue = document.querySelector('input[id="queue"]:checked').value;
	const enquiry = document.getElementById('enquiry').value;

	let data = {
		studentName,
		studentNumber,
		unitCode,
		queue,
		enquiry
	}

	//Checks user input
	if (validateUserInput(data)) {
		// Adds to state and rerender
		addToQueueList(data)
		hideAddToQueueForm();
	}
});

function terminateRow(id, action) {
	// This function is called when a session is finished or removed
	// update status and fetch update_entry
	// This below is a function being stored to a variable that can be returned
	const closureFunction = (currentElement) => {
		const status = action == "delete" ? "Ended" : "Completed"
		terminateSession({
			id,
			status
		})
}
return closureFunction
}

function addSessionToTeam(id, action){
	// This function is called when a student is moved to inSession queue or undo button is clicked
	// update status and fetch update_entry
	// This below is a function being stored to a variable that can be returned
	const closureFunction = (currentElement) => {
		const status = action == "add" ? "In Session" : "In Queue"
		moveToSessionOrUndo({
			id,
			status
		})
	}
	
return closureFunction
}

window.onclick = function (event) {
	// This is an event to enable deslection of the modal by clicking background
	if (event.target == document.getElementById('addToQueue')) {
		hideAddToQueueForm();
	}
};

function setTime(id) {
	if (document.getElementById('seconds' + id) != undefined) {
		timers[id]++;
		document.getElementById('seconds' + id).innerHTML = pad(timers[id] % 60);
		document.getElementById('minutes' + id).innerHTML = pad(parseInt(timers[id] / 60));
	} else {
		clearInterval(timerIntervals[id]);
	}
	if (timers[id] >= 600) {
		document.getElementById(id).className = 'yellowTime';
	}
	if (timers[id] >= 1200) {
		document.getElementById(id).className = 'orangeTime';
	}
	if (timers[id] >= 1800) {
		document.getElementById(id).className = 'redTime';
	}
}

function pad(val) {
	const valString = `${val}`
	if (valString.length < 2) {
		return `0${valString}`;
	} else {
		return valString;
	}
}

$('#studySmarterAvailableDecrement').click(function () {
	if (parseInt(document.getElementById('studySmarterAvailableCount').innerHTML) > 0) {
		document.getElementById('studySmarterAvailableCount').innerHTML -= 1;
	}
});
$('#studySmarterAvailableIncrement').click(function () {
	let curr = parseInt(document.getElementById('studySmarterAvailableCount').innerHTML);
	let next = curr + 1;
	document.getElementById('studySmarterAvailableCount').innerHTML = next;
});
$('#librariansAvailableDecrement').click(function () {
	if (parseInt(document.getElementById('librariansAvailableCount').innerHTML) > 0) {
		document.getElementById('librariansAvailableCount').innerHTML -= 1;
	}
});
$('#librariansAvailableIncrement').click(function () {
	let curr = parseInt(document.getElementById('librariansAvailableCount').innerHTML);
	let next = curr + 1;
	document.getElementById('librariansAvailableCount').innerHTML = next;
});

window.onload = async (event) => {
	console.info("Loading the Queue from API"); 

	// Load every queue from the API parallel
	const queueToLoad = Object.keys(queueList)

	const requestPromises = queueToLoad.map(async (queue) => {
		const response = await fetch("get_queue", {
			method: "POST",
			body: JSON.stringify({queue}),
			headers: {
				'Content-Type': 'application/json'
		}})
		const dataResponse = await response.json()
		return dataResponse
	})

	const responsesResult = await Promise.all(requestPromises)
	
	// This assumes that queueToLoad is of the same index dimension as responsesResult (dimension by map)
	queueToLoad.forEach((queue, index) => {
		// Assigns the result of the response to the correct queueList state
		queueList[queue] = responsesResult[index]["queue"]

		// Set the timers correctly for each of the elements
		responsesResult[index]["queue"].map(element => {
			const timeElement = element.status=="In Queue" ? "enterQueueTime" : "changeSessionTime"
			const timeDifferenceMiliseconds = (new Date()).getTime() - (new Date(element[timeElement])).getTime()
			// Convert to seconds (rounded)
			timers[element.id] = Math.round(timeDifferenceMiliseconds / 1000);
			timerIntervals[element.id] = setInterval(setTime, 1000, element.id);}
		)
	})
	// Load charts for data anylitcs page with current date
	generateChartsForWeek();
	rerenderTables();
};

// Submit button for export page
$('#dateSubmit').on('click', function(e) {
	const firstday = new Date('2021-09-28');
	// Setup date values
	let start = new Date();
	let end = new Date(start);
	// Get values from page
	const dateRange = $("input[name='dateRangeSelector']:checked").val()
	// Generate correct dates based of input
	switch(dateRange) {
		case 'Last Day':
			start.setDate(start.getDate()-1)
			break;
		case 'Last Week':
			start.setDate(start.getDate()-7)
			break;
		case 'Last Month':
			start.setMonth(start.getMonth()-1)
			break;
		case 'Last Year':
			start.setFullYear(start.getFullYear()-1)
			break;
		case 'All Time':
			start = firstday;
			break;
		case 'Custom':
			start = new Date(document.getElementById("startDate").value);
			end = new Date(document.getElementById("endDate").value);
			break;
	}
	// Format the dates to the appropriate dateTime format
	if(start < firstday) {
		start = firstday;
	}
	const startDate = start.toISOString().split("T").shift();
	const endDate = end.toISOString().split("T").shift();
	const startTime = `${startDate} 00:00:00.0000000`;
	const endTime = `${endDate} 23:59:59.999999`;
	// Send html request
	requestCSV({
		startTime,
		endTime
	})
})

const requestCSV = async (data) => {
	// This function requests a csv from the application with the database info between the two specified dates
	// 
	// The variable data must contain two dateTimes name startTime and endTime
	// and they must be strings of the format YYYY-MM-DD HH:MM:SS.SSSSSS ""
	try{
		const response = await fetch("CSV", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		// Retrieve filename from response headers
		const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
		const filename = filenameRegex.exec(response.headers.get('Content-Disposition'))[0].replace('filename=','');
		// Use response to construct a download 
		const dataResponse = await response.blob();
		const a = document.createElement("a");
		a.href = URL.createObjectURL(dataResponse);
		a.download = filename;
		document.body.appendChild(a);
		a.click();
	}
	catch(error){
		// There's an error
		console.log(error)
	}
}

$(document).ready(function() {
	if(document.getElementById("dateRange6").checked) {
		$(".date_selector").show("fast");
	}
})

$("input[name='dateRangeSelector']").click(function() {
	if($(this).attr("value")=="Custom") {
		$(".date_selector").show("fast");
	}
	else {
		$(".date_selector").hide("fast");
	}
})

function generateChartsForWeek(date=new Date()) {
	// Gets the most recently passed Sunday and the next upcomming Saturday
	var firstDay = new Date(date.setDate(date.getDate() - date.getDay())).toJSON().slice(0,10);
	var lastDay = new Date(date.setDate(date.getDate() - date.getDay() + 6)).toJSON().slice(0,10);

	// Format the dates to the appropriate dateTime format
	const startTime = `${firstDay} 00:00:00.0000000`;
	const endTime = `${lastDay} 23:59:59.999999`;
	// Send html request
	createDataChart({
		startTime,
		endTime
	})
}

// Generate all charts for a given week
function generateCharts(inputData, dates) {
	//----------------------------MAIN BAR GRAPH----------------------------
	// Get and set data for student chart
	let studentBarValues = inputData["studentBarGraph"];
	
	studentVisitsCount = [0,0,0,0,0,0,0];
	
	for (const [key, value] of Object.entries(studentBarValues)) {
		for(let i = 0; i < 7; i++) {
			if(dates[i] == rearrangeDate(key)) {
				studentVisitsCount[i] += value;
			}
		}
	}
	
	var dataStudent = {
		labels: [
			'Sun  ' + dates[0],
			'Mon  ' + dates[1],
			'Tue  ' + dates[2],
			'Wed  ' + dates[3],
			'Thu  ' + dates[4],
			'Fri  ' + dates[5],
			'Sat  ' + dates[6]
		],
		  series: [studentVisitsCount]
	  };

	// Set options for student chart
	var optionsStudent = {
		seriesBarDistance: 20,
		axisY: {
			onlyInteger: true
		}
	};
	
	// Create students graph
	new Chartist.Bar('#studentsVisitedBarChart', dataStudent, optionsStudent);

	//----------------------------UNITS PIE GRAPH----------------------------
	// Get and set data for units chart
	let topUnitValues = inputData["topUnitValues"];
	
	let unitsArray = [];
	let unitsCountArray = []

	// Pushes all unit codes and number of visits for them in data arrays
	Object.entries(topUnitValues).forEach(([key, value]) => {
		unitsArray.push(key);
		unitsCountArray.push(value);
	});

	// Only displays data if there was any that week
	if(unitsCountArray.length > 0) {
		var dataUnits = {series: unitsCountArray};
		
		var sum = function(a, b) {return a + b};

		// Set options for unit chart
		var optionsUnits = {
			labelInterpolationFnc: function(value, idx) {
				var percentage = Math.round(value / dataUnits.series.reduce(sum) * 100) + '%';
				return unitsArray[idx] + ' ' + percentage;
			}
		};
		
		// Set responsive options for unit chart
		var responsiveOptionsUnits = [
			['screen and (min-width: 640px)', {
				chartPadding: 30,
				labelOffset: 100,
				labelDirection: 'explode',
			}],
			['screen and (min-width: 1024px)', {
				labelOffset: 50,
				chartPadding: 20
			}]
		];
		
		// Create unit graph
		new Chartist.Pie('#unitsPieChart', dataUnits, optionsUnits, responsiveOptionsUnits);
	}
	// Display blank pie graph saying "No data for this week"
	else {
		new Chartist.Pie('#unitsPieChart', {series: [100]}, {
			labelInterpolationFnc: function(value) {
			  return "No data for this week"
			}
		  });
	}

	//----------------------------STAFF PIE GRAPH----------------------------
	// Get and set data for staff chart
	let staffPieValues = inputData["staffPieValues"];
	const staffTypes = ['STUDYSmarter', 'Librarians']

	let studySmarterPieValue = staffPieValues['STUDYSmarter'];
	let librarianPieValue = staffPieValues['Librarian'];

	if(studySmarterPieValue === undefined) {studySmarterPieValue = 0}
	if(librarianPieValue === undefined) {librarianPieValue = 0}

	// Only displays data if there was any that week
	if(studySmarterPieValue > 0 || librarianPieValue > 0) {
		var dataStaff = {
			series: [studySmarterPieValue, librarianPieValue]
		};

		// Set options for staff chart
		var optionsStaff = {
			labelInterpolationFnc: function(value, idx) {
				var percentage = Math.round(value / dataStaff.series.reduce(sum) * 100) + '%';
				return staffTypes[idx] + ' ' + percentage;
			}
		};
		
		// Set responsive options for staff chart
		var responsiveOptionsStaff = [
			['screen and (min-width: 640px)', {
				chartPadding: 30,
				labelOffset: 100,
				labelDirection: 'explode',
			}],
			['screen and (min-width: 1024px)', {
				labelOffset: 50,
				chartPadding: 20
			}]
		];
		
		// Create staff graph
		new Chartist.Pie('#unitsStaffChart', dataStaff, optionsStaff, responsiveOptionsStaff);
	}
	// Display blank pie graph saying "No data for this week"
	else {
		new Chartist.Pie('#unitsStaffChart', {series: [100]}, {
			labelInterpolationFnc: function(value) {
			  return "No data for this week"
			}
		  });
	}
}

// Gets selected date from page and generates charts
$('#dateSubmitForAnalytics').on('click', function(e) {
	const dateSubmitted = document.getElementById("date").value;
	var date = new Date(dateSubmitted);
	generateChartsForWeek(date);
})

// Changes date from yyyy/mm/dd to dd/mm/yy
function rearrangeDate(date) {
	var dateInt = date.split("");
	var newDate = dateInt[8]+dateInt[9]+"-"+dateInt[5]+dateInt[6]+"-"+dateInt[2]+dateInt[3];
	return newDate;
}

// Returns all dates the next 7 days from startTime
function getAllDaysOfWeek(startTime) {
	var start = new Date(startTime);
	const dates = new Array(7);
	var newDate = new Date(start.setDate(start.getDate())).toJSON().slice(0,10);
	dates[0] = rearrangeDate(newDate);
	
	for(var i = 1; i < 7; i++) {
		newDate = new Date(start.setDate(start.getDate() + 1)).toJSON().slice(0,10);
		dates[i] = rearrangeDate(newDate);
	};
	
	return dates;
}

// Gets number of student sessions in each day and displays them
const createDataChart = async (data) => {
	try{
		const response = await fetch("createChart", {
			method: "POST",
			body: JSON.stringify(data),
			headers: {
				'Content-Type': 'application/json'
			},
		})
		const dataResponse = await response.json();
		generateCharts(dataResponse, getAllDaysOfWeek(data.startTime.slice(0,10)));
	}
	catch(error){
		// There's an error
		console.log(error)
	}
}
