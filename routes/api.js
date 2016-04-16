var express = require('express');
var router = express.Router();
var emitter = require('../events/app-emitter');
var tournament = require('../models/tournament');

router.get('/data', function(req, res, next) {
	res.json(tournament.data === null ? {} : tournament.data);
});

router.post('/init', function(req, res, next) {
	tournament.init(req.body);
	res.json(tournament.data);
});

router.get('/resume', function(req, res, next) {
	tournament.start();
	res.json({timer: tournament.timer});
});

router.get('/pause', function(req, res, next) {
	tournament.pause();
	res.json({timer: tournament.timer});
});

router.get('/reset', function(req, res, next) {
	tournament.reinit();
	res.json({timer: tournament.timer});
});

module.exports = router;
