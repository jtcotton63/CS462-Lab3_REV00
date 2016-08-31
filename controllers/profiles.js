var fs = require('fs');
var https = require('https');
var os = require('os');
var User = require('../models/user');



function appendToFile(data, callback) {

	fs.appendFile('profiles_controller.log', data, function(err) {
		callback(err);
	});

}



function getUserData(path, token, callback) {

	var log = os.EOL + os.EOL + '--------------------------' + os.EOL + os.EOL;

	// Request access token for user from FourSquare API
	var address = 'api.foursquare.com';
	var params = '?v=20160827&oauth_token=' + token;
	var options = {
		host: address,
		path: path + params
	}

	// Write to log
	log += 'Request options: ' + JSON.stringify(options) + os.EOL;

	var req = https.request(options, function(res) {

		res.setEncoding('utf8');

		var data = '';

		res.on('data', function(chunk) {
			data += chunk;
		});

		res.on('end', function() {
			
			log += 'RESPONSE RECEIVED' + os.EOL;
			log += 'STATUS: ' + res.statusCode + os.EOL;
			log += 'DATA: ' + data + os.EOL;

			var body = null;
			try { body = JSON.parse(data); } catch(err) { 
				appendToFile(log, function(err) {
					callback(err, null, null);
				});
			}

			appendToFile(log, function(err) {
				callback(err, res.statusCode, body);
			});

		});

	});

	req.on('error', function(err) {
		
		log += '***** ERROR OCCURRED DURING REQUEST *****' + os.EOL;
		log += JSON.stringify(err) + os.EOL;
		appendToFile(log, function(err) {
			callback(err, null, null);
		});

	});

	req.end();

}



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

			var checkins = null;
			var link = null;
			var noData = null;
			var recent = null;

			if(ownSpace === true) {

				// If the user already has an fs_access token,
				// they don't need to connect to FS again
				if(user.fs_access_token) {

					// Make request to FS API to get information
					var path = '/v2/users/self/checkins';
					getUserData(path, user.fs_access_token, function(err, status, body) {

						if(err || status != 200) {

							res.status(500);
							res.send('An unexpected error occurred while getting FourSquare data. Body: ' + JSON.stringify(body));

						} else {

							checkins = body.response.checkins.items;
	    				    res.render('pages/profile', {
						        checkins: checkins,
						        link: link,
						        name: name,
						        no_data: noData,
						        recent: recent
						    });

						}


					})



				} else {

					link = '/connect';
				    res.render('pages/profile', {
				        checkins: checkins,
				        link: link,
				        name: name,
				        no_data: noData,
				        recent: recent
				    });

				}

			} else {

				// The current user is looking at another user's profile
				// If the other user already has an fs_access token,
				// we can display their most recent checkin
				if(user.fs_access_token) {

					// Make request to FS API to get other user's information
					var path = '/v2/checkins/recent';
					getUserData(path, user.fs_access_token, function(err, status, body) {

						if(err || status != 200) {

							res.status(500);
							res.send('An unexpected error occurred while getting FourSquare data. Body: ' + JSON.stringify(body));

						} else {

							recent = body.response.recent[0];
	    				    res.render('pages/profile', {
						        checkins: checkins,
						        link: link,
						        name: name,
						        no_data: noData,
						        recent: recent
						    });

						}


					})

				} else {

					// Other user doesn't have a token, so we can't display their data
					noData = 'No data to display for this user';
				    res.render('pages/profile', {
				        checkins: checkins,
				        link: link,
				        name: name,
				        no_data: noData,
				        recent: recent
				    });

				}

			}

		}

	});
    
};