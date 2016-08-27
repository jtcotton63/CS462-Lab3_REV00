var fs = require('fs');
var https = require('https');
var os = require('os');
var User = require('../models/user');



function appendToFile(data, callback) {

	fs.appendFile('profiles_controller.log', data, function(err) {
		callback(err);
	});

}



function getUserData(token, recent, callback) {

	var log = os.EOL + os.EOL + '--------------------------' + os.EOL + os.EOL;

	// Request access token for user from FourSquare API
	var address = 'api.foursquare.com';
	var params = '?v=20160827&oauth_token=' + token;
	var path = '/v2/users/self/checkins';
	if(recent)
		path += recent;
	path += params;

	var options = {
		host: address,
		path: path
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

			if(ownSpace === true) {

				// If the user already has an fs_access token,
				// they don't need to connect to FS again
				if(user.fs_access_token) {

					// Make request to FS API to get information
					getUserData(user.fs_access_token, null, function(err, status, body) {

						if(err || status != 200) {

							res.status(500);
							res.send('An unexpected error occurred while getting FourSquare data. Body: ' + JSON.stringify(body));

						} else {

							checkins = body.response.checkins.items;
	    				    res.render('pages/profile', {
						        checkins: checkins,
						        link: link,
						        name: name
						    });

						}


					})



				} else {

					link = '/connect';
				    res.render('pages/profile', {
				        checkins: checkins,
				        link: link,
				        name: name
				    });

				}

			} else {

				// Not their own space

				// Check if the other person has a token check-in data

				// If person has a token

				// display most recent check in

				// else 

				// display a message "hasn't connected to FS yet"


			    res.render('pages/profile', {
			    	checkins: checkins,
			        link: link,
			        name: name
			    });

			}

		}

	});
    
};