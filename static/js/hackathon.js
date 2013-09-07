var hackathonEndTime = 1378594800000;
var timeIncr = 1000; // ms of clock increment callback
var lastTime = 0;

$(document).ready(function () {
	lastTime = new Date().getTime();
	//console.log(hackathonEndTime - lastTime);
	console.log(hackathonEndTime);
	console.log(lastTime);
	$('#time_elem').html(formatDateTime(hackathonEndTime - lastTime));

	window.setInterval(function() { 
		lastTime = lastTime + timeIncr;
		$('#time_elem').html(formatDateTime(hackathonEndTime - lastTime));
	},
	timeIncr);
});

function formatDateTime(time) {
	if (time < 0) {
		return '00:00:00';
	}

	var d = time,
	    hours = Math.floor(d / 3600000),
	    minutes = Math.floor((d % 3600000) / 60000),
	    seconds = Math.floor((d % 60000) / 1000),
	    minutesStr = "",
	    secondsStr = "";

	    minutesStr = minutes.toString();
	    if (minutes < 10) {
	    	minutesStr = "0" + minutesStr;
	    }

	    secondsStr = seconds.toString();
	    if (seconds < 10) {
	    	secondsStr = "0" + secondsStr;
	    }


	return '' + hours + ':' + minutesStr + ':' + secondsStr;
}
