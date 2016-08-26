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
	res.cookie('session', cookie);
	res.redirect('/');

}

function verifyPassword(username, password, callback) {

	User.findOne({username: username, password: password}, function(err, user) {

		if(err) {

			console.log(err);
			callback(false);

		} else

			if(!user) {

				callback(false);

			} else {

				callback(true);

			}

	});

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

				verifyPassword(req.body.username, req.body.password, function(isMatch) {

					if(isMatch)
				
						onSucceed(req, res, user.cookie);
					
					else
					
						res.send('Invalid credentials. If you have previously registered with this username, you entered your password incorrectly. Please try again. If this is your first time logging in, the username you have chosen has already been taken. Please try again using a different username.');

				});

			}

		}

	});

};