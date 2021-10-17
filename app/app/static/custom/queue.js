// Window onload function
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
    rerenderTables();
};

window.onclick = function (event) {
	// This is an event to enable deslection of the modal by clicking background
	if (event.target == document.getElementById('addToQueue')) {
		hideAddToQueueForm();
	}
};

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

function showAlert(message, timer){
	Swal.fire({
		toast: true,
		position: 'top-end',
		showConfirmButton: false,
		timer: timer,
		timerProgressBar: true,
		padding: '1em',
		text: message
	})
}

function validateUserInput(data) {
	// Check student name
	if (data.studentName.length > 50) {
		showAlert("'Student Name' field should is too long.", 3500)
		return false;
	}
	if (!/^([^0-9]*)$/.test(data.studentName)) {
		showAlert("Please do not use numeric values in 'Student Name' field.", 3500)
		return false;
	}


	// Check student number
	if (data.studentNumber.length != 8) {
		showAlert("'Student Number' field should be an 8 digit number.", 3500)
		return false;
	}
	if (!/^([0-9]*)$/.test(data.studentNumber)) {
		showAlert("Please only numeric values in 'Student Number' field.", 3500)
		return false;
	}
	
	// Check unit code
	if (data.unitCode.length != 8 || !/([A-Za-z]){4}([0-9]){4}$/.test(data.unitCode)) {
		showAlert("'Unit Code' field should be 4 alphabetic characters followed by 4 numerics characters.", 3500)
		return false;
	}

	// Check enquiry type
	if (!/^([^0-9]*)$/.test(data.enquiry)) {
		showAlert("Please do not use numeric values in 'Enquiry Type' field.", 3500)
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
		<button type="button" rel="tooltip" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Place Student in Session" onclick="addSessionToTeam('${element.id}','add')(this)"><i class="material-icons">how_to_reg</i></button>
		<button type="button" rel="tooltip" class="btn btn-danger" data-toggle="tooltip" data-placement="top" title="Remove Student" onclick="customConfirm('Are you sure you want to remove ${element.studentName}?', '${element.id}','delete', this)"><i class="material-icons">close</i></button></td>
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
	<button type="button" rel="tooltip" class="btn btn-success" data-toggle="tooltip" data-placement="top" title="Finish Session" onclick="terminateRow('${element.id}','finish')(this)"><i class="material-icons">how_to_reg</i></button>
	<button type="button" rel="tooltip" class="btn btn-undo" title="Move Back to Queue" onclick="customConfirm('Move ${element.studentName} back to waiting queue?', '${element.id}','undo', this)"><i class="material-icons">undo</i></button>
	</tr>`).join("")
}

function customConfirm(message, id, action, row){
	Swal.fire({
		text: message,
		icon: 'warning',
		showCancelButton: true,
		confirmButtonColor: '#3085d6',
		cancelButtonColor: '#d33',
		confirmButtonText: 'Confirm'
	  }).then(function(result) {
		if (result.isConfirmed && action == 'undo') {addSessionToTeam(id, action)(row)}
		else if (result.isConfirmed && action == 'delete') {terminateRow(id, action)(row)}
	});
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

function staffAvailable(id) {
	let queue = findQueue(id);

	if(queue == "STUDYSmarter"){
		let STUDYSmarterStaff = document.getElementById('studySmarterAvailableCount').innerHTML;
		let STUDYSmarterInSession = $("table#inSession td:contains('STUDYSmarter')").length;
		if(STUDYSmarterStaff > STUDYSmarterInSession) {return true} //enough staff
		else {
			showAlert("All STUDYSmarter staff already in a session. Finish a session or increase staff available.", 5500)
			return false
		}
	}
	else if(queue == "Librarian"){
		let librarianStaff = document.getElementById('librariansAvailableCount').innerHTML;
		let librariansInSession = $("table#inSession td:contains('Librarian')").length;
		if(librarianStaff > librariansInSession) {return true} //enough staff
		else{
			showAlert("All Librarian staff already in a session. Finish a session or increase staff available.", 5500)
			return false
		}
	}
	//if something has gone wrong better to let them add to session than to block them
	else {return true}
}

function findQueue(id){
	for(let i = 0; i < queueList["STUDYSmarter"].length; i++) {
		if(queueList["STUDYSmarter"][i].id == id) {return "STUDYSmarter"}
	};

	for(let i = 0; i < queueList["Librarian"].length; i++) {
		if(queueList["Librarian"][i].id == id) {return "Librarian"}
	};

	return 0
}

function addSessionToTeam(id, action){
	// This function is called when a student is moved to inSession queue or undo button is clicked
	// update status and fetch update_entry
	// This below is a function being stored to a variable that can be returned
	const closureFunction = (currentElement) => {
		const status = action == "add" ? "In Session" : "In Queue"
		// can always move back to queue (undo) but only into session if enough staff is availble
		if(!(status == "In Session" && !staffAvailable(id))) {
			moveToSessionOrUndo({
				id,
				status
			})
		}
	}
	
return closureFunction
}

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