var TournamentViewModel = function() {
	'use strict';
	
	var self = this;

	self.suggestedBlinds = {
		"slow": [[1,2,0],[2,4,0],[3,6,0],[5,10,1],[7,14,1],
			[10,20,2],[15,30,2],[20,40,3],[30,60,5],[40,80,5],
			[50,100,5],[75,150,10],[100,200,10],[150,300,20],[200,400,30],
			[300,600,50],[400,800,50],[500,1000,100],[750,1500,100],[1000,2000,200]],
		"fast": [[1,2,0],[2,4,0],[4,8,0],[8,16,1],[10,20,2],
			[20,40,3],[40,80,5],[60,120,5],[80,160,10],[100,200,10],
			[150,300,20],[250,500,50],[500,1000,100],[750,1500,100],[1000,2000,200]]
	};
	self.timerId = null;
	self.enableAntes = ko.observable(false);
	self.smallestChip = ko.observable(0);
	self.blindLevel = ko.observable(1);
	self.blindProgression = ko.observable("slow");
	self.intervalTime = ko.observable(900);
	self.elapsedTime = ko.observable(0);
	self.blindTime = ko.observable(self.intervalTime());
	self.blindIntervals = ko.observableArray([{smallBlind: self.smallestChip(), 
		bigBlind: self.smallestChip() * 2, 
		ante: 0}]);
	self.isRunning = ko.observable(false);

	self.addBlindLevel = function(smallBlind, bigBlind, ante) {
		self.blindIntervals().push({smallBlind:smallBlind, bigBlind:bigBlind, ante:ante});
	};

	self.addBlindBasedOnPrevious = function(index) {
		if (self.blindIntervals().length > index) {
			var previousBlindLevel = self.blindIntervals()[index];
			self.addBlindLevel(previousBlindLevel.smallBlind * 2, previousBlindLevel.bigBlind * 2, 
	        		previousBlindLevel.ante * 2);
		} else {
			self.addBlindBasedOnPrevious(index - 1);
		}
	};

	self.prepareNextBlindLevel = function() {
		var idx = self.blindLevel() - 1;
		if (self.blindIntervals().length < self.blindLevel()) {
        	self.addBlindBasedOnPrevious(idx - 1);
        }
        return idx;
	};

	self.broadcast = function() {
		$.ajax({
			url: "/api/init",
			data: ko.toJSON(self),
			contentType: "application/json",
			dataType: "json",
			method: "POST"
		}).done(function(result) {
			console.log(result);
		}).fail(function(err) {
			console.log(err);
		});
	};

	self.secondsToHms = function(d) {
		d = Number(d);
		var h = Math.floor(d / 3600);
		var m = Math.floor(d % 3600 / 60);
		var s = Math.floor(d % 3600 % 60);
		var result = "";

		result = ((h > 0 ? h + ":" + (m < 10 ? "0" : "") : "") + m + ":" + (s < 10 ? "0" : "") + s); 

		return result;
	};

	self.tournamentStyles = ko.computed(function() {
		var result = [];
		if (self.blindTime() > self.intervalTime() / 2 && self.blindTime() > 180) {
			result.push("bg-success");
		} else if (self.blindTime() <= self.intervalTime() / 2 && self.blindTime() > 180) {
			result.push("bg-info");
		} else if (self.blindTime() > 60 && self.blindTime() <= 180) {
			result.push("bg-warning");
		} else if (self.blindTime() <= 60) {
			result.push("bg-danger");
		}

		if (self.blindTime() < 10 && self.blindTime() % 2 === 1) {
			result.push("interval-danger-odd");
		}
		return result.join(" ");
	});

	self.smallBlind = ko.computed(function() {
        var idx = self.prepareNextBlindLevel();
        return self.blindIntervals()[idx].smallBlind;
    });

    self.bigBlind = ko.computed(function() {
        var idx = self.prepareNextBlindLevel();
        return self.blindIntervals()[idx].bigBlind;
    });

    self.ante = ko.computed(function() {
        var idx = self.prepareNextBlindLevel();
        return self.blindIntervals()[idx].ante;
    });

	self.smallestChip.subscribe(function() {
		var result = [];
		var suggestedBlinds = self.suggestedBlinds[self.blindProgression()];
		var smallestChip = self.smallestChip();
		for (var i=0; i < suggestedBlinds.length; i++) {
			result.push({
				smallBlind: suggestedBlinds[i][0] * smallestChip,
				bigBlind: suggestedBlinds[i][1] * smallestChip,
				ante: suggestedBlinds[i][2] * smallestChip
			});
		}
		self.blindIntervals(result);
	});

	self.StartCounter = function(){
		self.isRunning(true);
		//self.broadcast();
		if (self.timerId === null) {
			self.timerId = window.setInterval(function(){
				self.elapsedTime(self.elapsedTime()+1);
				self.blindTime(self.blindTime()-1);
				if(self.blindTime() === 0){
					// adjust blinds
					self.AdjustBlinds();
				}
			},1000);
		}
	};
	self.StopCounter = function(){
		clearInterval(self.timerId);
		self.timerId = null;
		self.isRunning(false);
		//self.broadcast();
	};
	self.AdjustBlinds = function(){
		self.blindTime(self.intervalTime());
		self.blindLevel(self.blindLevel()+1);
	};
};