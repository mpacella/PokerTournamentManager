var socket = io("http://192.168.1.120:3000");

socket.on("disconnect", function() {
	console.log("socket disconnected");
});

socket.on("connect", function() {
	console.log("connected to socket");
});

// Here's my data model
var TournamentViewModel = function() {
	var self = this;

	self.timerId = null;
	self.smallestChip = ko.observable(25);
	self.blindLevel = ko.observable(1);
	self.intervalTime = ko.observable(900);
	self.elapsedTime = ko.observable(0);
	self.blindTime = ko.observable(self.intervalTime());
	self.smallBlind = ko.observable(self.smallestChip());
	self.bigBlind = ko.observable(self.smallBlind() * 2);
	self.isRunning = ko.observable(false);
	self.subscribed = ko.observable(false);

	// Whenever the smallestChip changes, reset the smallBlind and bigBlind
	self.smallestChip.subscribe(function() {
		if (self.smallBlind() % self.smallestChip() !== 0) {
			self.smallBlind(self.smallestChip());
		}
	});

	self.smallBlind.subscribe(function() {
		self.bigBlind(self.smallBlind() * 2);
		if (!self.subscribed()) {
			socket.emit("chat", ko.toJSON(self));
		}
	});

	self.StartCounter = function(){
		self.isRunning(true);
		if (!self.subscribed()) {
			socket.emit("chat", ko.toJSON(self));
		}
		self.timerId = window.setInterval(function(){
			self.elapsedTime(self.elapsedTime()+1);
			self.blindTime(self.blindTime()-1);
			if(self.blindTime() === 0){
				// adjust blinds
				self.AdjustBlinds();
			}
		},1000)
	}
	self.StopCounter = function(){
		clearInterval(self.timerId);
		self.timerId = null;
		self.isRunning(false);
		if (!self.subscribed()) {
			socket.emit("chat", ko.toJSON(self));
		}
	}
	self.AdjustBlinds = function(){
		self.blindTime(self.intervalTime());
		self.smallBlind(self.smallBlind() * 2);
		self.blindLevel(self.blindLevel()+1);
	}
};

var secondsToHms = function(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	var result = "";

	result = ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 

	return result;
}

var tournamentViewModel = new TournamentViewModel();
ko.applyBindings(tournamentViewModel); // This makes Knockout get to work

socket.on("message", function(message) {
	var tournamentData = JSON.parse(message);
	tournamentViewModel.subscribed(true);
	tournamentViewModel.smallestChip(tournamentData.smallestChip);
	tournamentViewModel.blindLevel(tournamentData.blindLevel);
	tournamentViewModel.intervalTime(tournamentData.intervalTime);
	tournamentViewModel.elapsedTime(tournamentData.elapsedTime);
	tournamentViewModel.blindTime(tournamentData.blindTime);
	tournamentViewModel.smallBlind(tournamentData.smallBlind);
	tournamentViewModel.bigBlind(tournamentData.bigBlind);
	tournamentViewModel.isRunning(tournamentData.isRunning);

	if (tournamentViewModel.timerId === null && tournamentData.isRunning) {
		tournamentViewModel.StartCounter();
	}
	if (tournamentViewModel.timerId !== null && !tournamentData.isRunning) {
		tournamentViewModel.StopCounter();
	}
});