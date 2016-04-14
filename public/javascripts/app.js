var secondsToHms = function(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	var result = "";

	result = ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 

	return result;
};

var tournamentViewModel = new TournamentViewModel();
ko.applyBindings(tournamentViewModel); // This makes Knockout get to work
tournamentViewModel.smallestChip(25);

var socket = io("http://" + window.location.hostname + ":" + window.location.port);
socket.on("disconnect", function() {
	console.log("socket disconnected");
});

socket.on("connect", function() {
	console.log("connected to socket");
});
socket.on("pollingEvent", function(message) {
	console.log(message);
	/*
	var tournamentData = JSON.parse(message);
	console.log("message from client");
	//tournamentViewModel.subscribed(true);
	tournamentViewModel.smallestChip(tournamentData.smallestChip);
	tournamentViewModel.blindLevel(tournamentData.blindLevel);
	tournamentViewModel.intervalTime(tournamentData.intervalTime);
	tournamentViewModel.elapsedTime(tournamentData.elapsedTime);
	tournamentViewModel.blindTime(tournamentData.blindTime);
	tournamentViewModel.smallBlind(tournamentData.smallBlind);
	tournamentViewModel.bigBlind(tournamentData.bigBlind);
	tournamentViewModel.isRunning(tournamentData.isRunning);

	if (tournamentViewModel.timerId === null && tournamentData.isRunning) {
		console.log("StartCounter");
		tournamentViewModel.StartCounter();
	} else if (tournamentViewModel.timerId !== null && !tournamentData.isRunning) {
		console.log("StopCounter");
		tournamentViewModel.StopCounter();
	}
	*/
});