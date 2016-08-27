var crypto = require('crypto');
var User = require('../models/user');



exports.get = function(req, res) {
	
	User.find(function(err, users) {

		if(err)
			res.send(err);

		res.json(users);

	});

};



function onSucceed(req, res, cookie) {

	// Set cookie identifying the user
	res.cookie('session', cookie, {maxAge: 1800000});
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

				var cookie = crypto.randomBytes(32).toString('hex');

				var user = new User(

					{
						username: req.body.username,
						password: req.body.password,
						cookie: cookie
					}

				);

				user.save(function(err) {

					if(err)

						res.send(err);

					else {

						onSucceed(req, res, cookie);

					}
					

				});

			} else {

				if(user.password !== req.body.password)

					res.send('Invalid credentials. If you have previously registered with this username, you entered your password incorrectly. Please try again. If this is your first time logging in, the username you have chosen has already been taken. Please try again using a different username.');

				else

					onSucceed(req, res, user.cookie);

			}

		}

	});

};