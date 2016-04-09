// Here's my data model
var ViewModel = function() {
	var self = this;

	self.intervalTime = ko.observable(900);
	self.elapsedTime = ko.observable(0);
    self.blindTime = ko.observable(self.intervalTime());
    self.smallBlind = ko.observable(25);
    self.bigBlind = ko.observable(50);
    self.isRunning = ko.observable(false);

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
    	self.bigBlind(self.bigBlind() * 2);
    }
};

var secondsToHms = function(d) {
	d = Number(d);
	var h = Math.floor(d / 3600);
	var m = Math.floor(d % 3600 / 60);
	var s = Math.floor(d % 3600 % 60);
	return ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 
}
 
ko.applyBindings(new ViewModel()); // This makes Knockout get to work

