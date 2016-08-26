var User = require('../models/user');



exports.get = function(req, res) {
	
	User.find(function(err, users) {

		if(err)
			res.send(err);

		res.json(users);

	});

};



function onSucceed(req, res, username) {

	// Create a custom cookie for this user
	// The cookie value is the username
	res.cookie('session', username);
	res.redirect('/');

}



exports.post = function(req, res) {

	// First check and see if it exists
	User.findOne({username: req.body.username}, function(err, user) {

		if(err)

			res.send(err);

		else {

			// User wasn't found; create new user
			if(!user) {

				var user = new User(

					{
						username: req.body.username
					}

				);

				user.save(function(err) {

					if(err)

						res.send(err);

					else {

						onSucceed(req, res, req.body.username);

					}
					

				});

			} else {

				onSucceed(req, res, req.body.username);

			}

		}

	});

};