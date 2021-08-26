var timers = [];
var timerIntervals = [];

function showAddToQueue() {
	$('#addToQueue').css('display', 'block');
}

function hideAddToQueue() {
	document.getElementById('addToQueueForm').reset();
	$('#addToQueue').css('display', 'none');
}

$('#addToQueueForm').submit(function (e) {
	e.preventDefault();

	let name = document.getElementById('studentName').value;
	let id = document.getElementById('studentNumber').value;
	let unit = document.getElementById('unitCode').value;
	let team = document.getElementById('team').value;
	let enquiry = document.getElementById('enquiryType').value;

	if (team == 'STUDYSmarter') {
		var table = $('#SSQueueTable tbody');
	} else {
		var table = $('#libQueueTable tbody');
	}

	table.append(
		'<tr id="' +
			id +
			'" class="initialTime">' +
			'<td>' +
			name +
			'</td>' +
			'<td>' +
			id +
			'</td>' +
			'<td>' +
			unit +
			'</td>' +
			'<td class="text-right">' +
			enquiry +
			'</td>' +
			'<td class="text-right">' +
			'<label id="minutes' +
			id +
			'">00</label><label id="colon">:</label><label id="seconds' +
			id +
			'">00</label>' +
			'</td>' +
			'<td class="td-actions text-right">\
			<button type="button" rel="tooltip" class="btn btn-success"><i class="material-icons">how_to_reg</i></button>\
			<button type="button" rel="tooltip" class="btn btn-danger" onclick="deleteRow(this)"><i class="material-icons">close</i></button>\
			</td>' +
			'</tr>'
	);
	hideAddToQueue();
	timers[id] = 0;
	console.log(timers[id]);
	timerIntervals[id] = setInterval(setTime, 1000, id);
});

function deleteRow(x) {
	$(x).parents('tr').remove();
}
/*
*
* OUR CUSTOM JAVASCRIPT SHOULD BE ADDED HERE
*
*/

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
		return '0' + valString;
	} else {
		return valString;
	}
}

$('#studySmarterAvailableDec').click(function () {
	if (parseInt(document.getElementById('studySmarterAvailableCount').innerHTML) > 0) {
		document.getElementById('studySmarterAvailableCount').innerHTML -= 1;
	}
});
$('#studySmarterAvailableInc').click(function () {
	let curr = parseInt(document.getElementById('studySmarterAvailableCount').innerHTML);
	let next = curr + 1;
	document.getElementById('studySmarterAvailableCount').innerHTML = next;
});
$('#librariansAvailableDec').click(function () {
	if (parseInt(document.getElementById('librariansAvailableCount').innerHTML) > 0) {
		document.getElementById('librariansAvailableCount').innerHTML -= 1;
	}
});
$('#librariansAvailableInc').click(function () {
	let curr = parseInt(document.getElementById('librariansAvailableCount').innerHTML);
	let next = curr + 1;
	document.getElementById('librariansAvailableCount').innerHTML = next;
});
