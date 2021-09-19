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
	"In Session": []
}

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

const moveToSessionList = async(data) => {
	// This function move the data (object - of the student details) to the in Session table
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
		const index = queueList[dataResponse.queue].findIndex((element) => element.id == dataResponse.id)
		// pop the data from waiting queue
		queueList[dataResponse.queue].splice(index, 1)
		queueList['In Session'].push(dataResponse)

		clearInterval(timerIntervals[dataResponse.id]);
		timers[dataResponse.id] = 0;
		timerIntervals[dataResponse.id] = setInterval(setTime, 1000, dataResponse.id);
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
		<button type="button" rel="tooltip" class="btn btn-success" onclick="addSessionToTeam('${element.id}','${element.status}')(this); deleteRow(this)"><i class="material-icons">how_to_reg</i></button>
		<button type="button" rel="tooltip" class="btn btn-danger" onclick="deleteRow('${element.id}','${element.status}')(this)"><i class="material-icons">close</i></button></td>
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
	<button type="button" rel="tooltip" class="btn btn-success" onclick="finishRow('${element.id}','${element.status}')(this)"><i class="material-icons">how_to_reg</i></button>
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
	const queue = document.getElementById('queue').value;
	const enquiry = document.getElementById('enquiry').value;

	// Adds to state and rerender
	addToQueueList({
		studentName,
		studentNumber,
		unitCode,
		queue,
		enquiry
	})

	hideAddToQueueForm();
});

function deleteRow(id, status) {
	const closureFunction = (currentElement) => {
		status = "Ended"
		terminateSession({
			id,
			status
		})
}
return closureFunction
}

function finishRow(id, status) {
	const closureFunction = (currentElement) => {
		status = "Completed"
		terminateSession({
			id,
			status
		})
}
return closureFunction
}

function addSessionToTeam(id, status){
	// This below is a function being stored to a variable that can be returned
	const closureFunction = (currentElement) => {
		status = "In Session"
		clearInterval(id);		
		moveToSessionList({
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
	if (timers[id] == 600) {
		document.getElementById(id).className = 'yellowTime';
	}
	if (timers[id] == 1200) {
		document.getElementById(id).className = 'orangeTime';
	}
	if (timers[id] == 1800) {
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

			if (element.status == "In Queue") {
				// Today - `enterQueueTime` is the relative date in seconds
				const timeDifferenceMiliseconds = (new Date()).getTime() - (new Date(element.enterQueueTime)).getTime()

				// Convert to seconds (rounded)
				timers[element.id] = Math.round(timeDifferenceMiliseconds / 1000);
				timerIntervals[element.id] = setInterval(setTime, 1000, element.id);}

			else {
				const timeDifferenceMiliseconds = (new Date()).getTime() - (new Date(element.changeSessionTime)).getTime()
				// Convert to seconds (rounded)
				timers[element.id] = Math.round(timeDifferenceMiliseconds / 1000);
				timerIntervals[element.id] = setInterval(setTime, 1000, element.id);}
		})
	})
	rerenderTables();
	
};