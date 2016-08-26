var User = require('../models/user');



function parseCookie(cookies) {

	if(cookies && cookies.session) {

		return cookies.session;

	 } else

		return null;

}



exports.getUsernameForCookie = function(req, res, callback) {

	var cookie = parseCookie(req.cookies);

	if(cookie) {

		User.findOne({ cookie: cookie }, function(err, user) {

			if(err)

				callback(req, res, err);

			else {

				if(!user) {

					callback(req, res, null);

				} else {

					callback(req, res, user.username);

				}

			}


		});

	}

	else

		callback(req, res, null);

};