var express 	= require('express');
var path 		= require('path');

var models 		= require('../lib/models.js');


var router	= express.Router();
var User  	= models.User;


/**
Returns the list of online users
*/
router.get('/', function(req, res, next) {
	User.findAll().then(function(users) {
		return res.json({
			code: 0,
			msg: users
		});
	});
});


router.post('/', function(req, res, next) {
	var name 		= req.body.name;
	var username 	= req.body.username;

	var errors = [];
	if(!name || name.length <= 0) {
		errors.push("name field is not valid");
	}

	if(!username || username.length <= 0) {
		errors.push("username field is not valid");
	}

	if(errors.length === 0) { 	// If no errors found
		User.findOne({
			where: {userName: username}
		}).then(function(user) {
			if(user) {
				errors.push("Username is already taken");
			}
			if(errors.length > 0) {
				return res.json({
					code: -1,
					msg: errors
				});
			} else {
				var nameTokens = name.split(' ');
				var fn = "", ln = "";
				if(nameTokens.length > 0) {
					fn = nameTokens[0].trim();
					ln = nameTokens.slice(1).join(' ').trim();
				}
				User.create({
					firstName: fn,
					lastName: ln,
					userName: username
				}).then(function(user) {
					if(user) {
						return res.json({
							code: 0,
							msg: user
						});
					} else {
						return res.json({
							code: -1,
							msg: "Something went wrong. Please try again"
						});
					}
				});
			}
		});
	}

});

module.exports = router;
