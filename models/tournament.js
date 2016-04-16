var tournament = function() {
	if ( arguments.callee._singletonInstance )
        return arguments.callee._singletonInstance;
	var self = this;
    self.data = null;
    self.timer = 0;
    self.blindsTimer = null;
    self.init = function(data) {
    	self.data = data;
    };
    self.start = function() {
	    if (self.blindsTimer === null) {
			self.blindsTimer = setInterval(function() {
				self.timer++;
				if (self.timer % 30 === 1) {
					//every 30 seconds, push data back to clients
				}
			}, 1000);
		}
    };
    self.pause = function() {
    	if (self.blindsTimer !== null) {
	    	clearInterval(self.blindsTimer);
			self.blindsTimer = null;
		}
    };
    self.reinit = function() {

    };
    arguments.callee._singletonInstance = self;  
};

module.exports = new tournament();