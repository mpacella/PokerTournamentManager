var express = require('express');
var router = express.Router();
var emitter = require('../events/app-emitter');

var timer = 0;
var blindsTimer = null;

router.get('/', function(req, res, next) {
	res.json({'timer':timer, 'status': blindsTimer === null ? "Paused" : "Running"});
});

router.get('/start', function(req, res, next) {
	if (blindsTimer === null) {
		blindsTimer = setInterval(function() {
			timer++;
			if (timer % 10 === 1) {
				emitter.emit("pollingEvent", "10 seconds");
			}
		}, 1000);
	}
	res.json({'status': "Started"});
});

router.get('/pause', function(req, res, next) {
	res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
	res.header('Expires', '-1');
	res.header('Pragma', 'no-cache');
	clearInterval(blindsTimer);
	blindsTimer = null;
	res.json({'status': "Paused"});
});

module.exports = router;
