var User = require('../models/user');



exports.put = function(req, res) {

	User.findOne({username: req.params.username}, function(err, user) {

		if(err) {

			res.status(500);
			res.send(err);

		} else {

			// Update fields
			if(req.body.password)
				user.password = req.body.password;

			if(req.body.cookie)
				user.cookie = req.body.cookie;

			if(req.body.fs_access_token)
				user.fs_access_token = req.body.fs_access_token;

			user.save(function(err) {

				if(err) {

					res.status(500);
					res.send(err);

				} else {

					res.json(user);

				}

			});

		}


	});

};