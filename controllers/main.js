var User = require('../models/user');



exports.get = function(req, res, username) {

	// Get a list of all users
	User.find(function(err, users) {

		if(err)
			
			res.send(err);

		else {

			var part = 'Welcome to Joseph\'s App';
			var statement = (username ? 'Hi ' + username + '! ' + part : part);

			res.render('pages/index', {
		        statement: statement,
		        users: users
		    });

		}

	});

};