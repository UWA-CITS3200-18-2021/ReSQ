/*
*
* OUR CUSTOM JAVASCRIPT SHOULD BE ADDED HERE
*
*/

var inSessionTable = $('#inSession tbody');
const timers = [];
const timerIntervals = [];

const queueList = {
	"STUDYSmarter":[],
	"Librarian":[]
}

const addToQueueList = async (data) => {
	// This function adds the data (object - of the student details) to the specified queueList
	// And rerenders the table


	try{
		const response = await fetch("add_entry", {
			method: "POST",
			body: data
		})
		console.log()
		queueList[data.team].push(data)
	}
	catch(err){
		// Maybe even display an alert
		console.error(error)
	}

	timers[data.id] = 0;
	timerIntervals[data.id] = setInterval(setTime, 1000, data.id);
	rerenderTables()
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
		<td>${element.name}</td>
		<td>${element.id}</td>
		<td>${element.unit}</td>
		<td class="text-right">${element.enquiry}</td>
		<td class="text-right"><label id="minutes${element.id}">00</label><label id="colon">:</label><label id="seconds${element.id}">00</label></td>
		<td class="td-actions text-right">
		<button type="button" rel="tooltip" class="btn btn-success" onclick="addSessionToTeam('${element.team}',${element.id})(this)"><i class="material-icons">how_to_reg</i></button>
		<button type="button" rel="tooltip" class="btn btn-danger" onclick="deleteRow(this)"><i class="material-icons">close</i></button></td>
		</tr>`).join("")
	})
}
function showAddToQueue() {
	$('#addToQueue').css('display', 'block');
}

function hideAddToQueue() {
	document.getElementById('addToQueueForm').reset();
	$('#addToQueue').css('display', 'none');
}

$('#addToQueueForm').submit(function (e) {
	// This is the function that executes on the submission of the Student Data
	e.preventDefault();

	let name = document.getElementById('studentName').value;
	let studentNumber = document.getElementById('studentNumber').value;
	let unitCode = document.getElementById('unitCode').value;
	let queue = document.getElementById('queue').value;
	let enquiryType = document.getElementById('enquiryType').value;

	addToQueueList({
		name,
		studentNumber,
		unitCode,
		queue,
		enquiryType
	})
});

function deleteRow(x) {
	$(x).parents('tr').remove();
}

function addSessionToTeam(team, id){
	// This below is a function being stored to a variable that can be returned
	const closureFunction = (currentElement) => {
		console.log(currentElement)
		var row = $(currentElement).parents('tr');
		row.children().first().before(`<td>${team}</td>`);
		row.children().last().remove();
		row.children().last().after(`<td class="td-actions text-right"><button type="button" rel="tooltip" class="btn btn-success" onclick="deleteRow(this)"><i class="material-icons">how_to_reg</i></button></td>`);	
		inSessionTable.append(row);
		
		clearInterval(timerIntervals[id]);
		timers[id] = 0;
		timerIntervals[id] = setInterval(setTime, 1000, id);
	}
	
return closureFunction
}

window.onclick = function (event) {
	if (event.target == document.getElementById('addToQueue')) {
		hideAddToQueue();
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
