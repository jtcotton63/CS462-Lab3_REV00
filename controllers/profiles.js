var User = require('../models/user');



exports.get = function(req, res, username) {

	var ownSpace = (username === req.params.username ? true : false);

	var name = ( ownSpace ? 'your' : req.params.username + '\'s');

	User.findOne({username: req.params.username}, function(err, user) {

		if(err) {

			res.status(500);
			res.send(err);

		} else if(!user){

			res.status(400);
			res.send('User ' + username + ' doesn\'t exist');

		} else {

			var link = null;

			if(ownSpace) {

				// If the user already has an fs_access token,
				// they don't need to connect to FS again
				if(user.fs_access_token) {

					link = null;

					// Display detailed location data

				} else {

					link = '/connect';

				}

			} else {

				// Not their own space

				// Other person may or may not have check-in data

				// If person has check-in data

				// user = check-in data

				// else 

				// user = null (so it doesn't display)

			}


		    res.render('pages/profile', 

			    {
			        link: link,
			        name: name
			    }

		    );

		}

	});
    
};