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

				res.send(err);

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


function onFailAdmin(req, res) {

	res.send('You are not authorized to view this content');

}




exports.getAdminUsernameForCookie = function(req, res, callback) {

	var cookie = parseCookie(req.cookies);

	if(cookie) {

		User.findOne({ cookie: cookie }, function(err, user) {

			console.log('User ' + user);

			if(err)

				res.send(err);

			else {

				if(!user) {

					onFailAdmin(req, res);

				} else {

					if(user.username !== 'jtcotton63')

						onFailAdmin(req, res);

					else

						callback(req, res);

				}

			}


		});

	}

	else

		onFailAdmin(req, res);

};