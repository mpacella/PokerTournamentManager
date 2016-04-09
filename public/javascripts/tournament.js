// Here's my data model
var TournamentViewModel = function() {
	var self = this;

    self.smallestChip = ko.observable(10);
	self.blindLevel = ko.observable(1);
	self.intervalTime = ko.observable(10);
	self.elapsedTime = ko.observable(0);
    self.blindTime = ko.observable(self.intervalTime());
    self.smallBlind = ko.observable(self.smallestChip());
    self.bigBlind = ko.observable(self.smallBlind() * 2);
    self.isRunning = ko.observable(false);

    // Whenever the smallestChip changes, reset the smallBlind and bigBlind
    self.smallestChip.subscribe(function() {
        if (self.smallBlind() % self.smallestChip() !== 0) {
            self.smallBlind(self.smallestChip());
        }
    });

    self.smallBlind.subscribe(function() {
        self.bigBlind(self.smallBlind() * 2);
    });

    self.StartCounter = function(){
        self.isRunning(true);
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
        self.isRunning(false);
    }
    self.AdjustBlinds = function(){
    	self.blindTime(self.intervalTime());
    	self.smallBlind(self.smallBlind() * 2);
        self.blindLevel(self.blindLevel()+1);
    }
};