var express = require('express');
var path = require('path');


var router = express.Router();

router.get('/', function(req, res, next) {
	return res.render('index', {pageTitle: 'Juicy Pussy'});
});

module.exports = router;
