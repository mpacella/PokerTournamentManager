(function(ko, TournamentViewModel) {
	'use strict';

	var tournamentViewModel = new TournamentViewModel();
	ko.options.deferUpdates = true;
	ko.applyBindings(tournamentViewModel);
	tournamentViewModel.smallestChip(25);

	/*
	var ws = new WebSocket("ws://" + window.location.hostname + ":" + window.location.port);
	ws.onopen = function() {
		console.log("ws.onopen");
	};
	ws.onclose = function() {
		console.log("disconnected");
	};
	ws.onmessage = function(payload) {
		console.log(payload);
	};
	*/
})(ko, TournamentViewModel);
