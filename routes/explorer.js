var express = require('express');
var path 	= require('path');
var fs 		= require('fs');

// var lcs 	= require('../lib/lcs');


var router = express.Router();

router.get('/', function(req, res, next) {
	return res.render('explorer', {pageTitle: 'Explorer'});
});


router.get('/vocab.json', function(req, res, next) {
	fs.readFile('./lib/vocab.json', function(err, data) {
		if(err) {
			console.error(err);
			return res.json({
				code: -1,
				msg:  err
			});
		}

		return res.json({
			code: 0,
			msg: JSON.parse(data)
		});
	});
});


router.get('/search', function(req, res, next) {
	var q = req.query.q;
	if(q) {
		q = q.trim().toLowerCase();
	}
	if(q && q.length >= 2) {

		fs.readFile('./lib/vocab.txt', function(err, data) {
			if(err) {
				console.error(err);
				return res.json({
					code: -1,
					msg: err
				});
			}
			var words = data.toString().split('\n');
			var candidates = [];
			words.forEach(function(w) {
				var ii = w.indexOf(q);
				if(ii >= 0) {
					candidates.push({ind: ii, word: w});
				}
			});

			candidates.sort(function(p, q) {
				return p.ind - q.ind;
			});
			return res.json({
				code: 0,
				msg: candidates.slice(0, 5)
			});
		});
	} else {
		return res.json({
			code: 0,
			msg: []
		});
	}
});

module.exports = router;
