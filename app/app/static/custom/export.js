// Window onload function
window.onload = async (event) => {
	if(document.getElementById("dateRange6").checked) {
		$(".date_selector").show("fast");
	}
}

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
	const startTime = `${startDate} 00:00:00.000000`;
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

$("input[name='dateRangeSelector']").click(function() {
	if($(this).attr("value")=="Custom") {
		$(".date_selector").show("fast");
	}
	else {
		$(".date_selector").hide("fast");
	}
})