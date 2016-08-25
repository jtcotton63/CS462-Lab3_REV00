var User = require('../models/user');



exports.get = function(req, res) {
	
	User.find(function(err, users) {

		if(err)
			res.send(err);

		res.json(users);

	});

};



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

						res.redirect('/');

					}
					

				});

			} else {

				res.redirect('/');

			}

		}

	});

};