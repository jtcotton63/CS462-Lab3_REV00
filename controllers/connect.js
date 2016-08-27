var User = require('../models/user');



exports.getClientID = function(callback) {
	var clientID = 'YOUR_CLIENT_ID';
	callback(clientID);
};



exports.getRedirectURI = function(callback) {
	var redirectURI = 'YOUR_REGISTERED_REDIRECT_URI';
	callback(redirectURI);
};



exports.get = function(req, res, username) {

	if(!username) {

		res.status(400);
		res.send('Invalid user. Contact tech support.');

	} else {

		User.findOne({username: username}, function(err, user) {

			if(err) {

				res.status(500);
				res.send(err);

			} else if(!user){

				res.status(400);
				res.send('User ' + username + ' doesn\'t exist');

			} else {

				exports.getClientID(function(clientID) {

					exports.getRedirectURI(function(redirectURI) {

						// Request code from FourSquare API
						var address = 'https://foursquare.com/oauth2/authenticate';
						var full = address + '?client_id=' + clientID + '&response_type=code&redirect_uri=' + redirectURI;
						res.redirect(full);

					});

				});

			}

		});

	}

};