//Window onload event
window.onload = async (event) => {
    // Load charts for data anylitcs page with current date
	generateChartsForWeek();
}

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