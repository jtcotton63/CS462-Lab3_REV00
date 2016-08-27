var connectController = require('./connect');
var fs = require('fs');
var os = require('os');
var https = require('https');
var User = require('../models/user');
var userController = require('./user');



function appendToFile(data, callback) {

	fs.appendFile('code_controller.log', data, function(err) {
		callback(err);
	});

}



function updateUserWithToken(username, token) {

	userController.getUserByUsername(username, function(err, user) {

		if(err) {

			var data = 'Error while accessing database' + os.EOL;
			data += 'username: ' + username + os.EOL;
			data += 'token: ' + token + os.EOL;
			data += 'Error: ' + JSON.stringify(err) + os.EOL;
			appendToFile(data, function(err) {});

		} else if(!user){

			var data = 'User' + username + ' was not found in the database' + os.EOL;
			data += 'token: ' + token + os.EOL;
			appendToFile(data, function(err) {});

		} else {

			if(token)
				user.fs_access_token = token;

			userController.saveUser(user, function(err) {

				if(err) {

					var data = 'Error while saving user to database' + os.EOL;
					data += 'User: ' + user+ os.EOL;
					data += 'username: ' + username + os.EOL;
					data += 'token: ' + token + os.EOL;
					data += 'Error: ' + JSON.stringify(err) + os.EOL;
					appendToFile(data, function(err) {});

				} else {

					var data = 'User' + username + ' was successfully updated in the database' + os.EOL;
					data += 'User: ' + JSON.stringify(user) + os.EOL;
					appendToFile(data, function(err) {});


				}

			});

		}

	});

}



function exchangeCode(code, username) {

	connectController.getClientID(function(clientID) {

		connectController.getRedirectURI(function(redirectURI) {

			var log = os.EOL + os.EOL + '--------------------------' + os.EOL + os.EOL;

			var clientSecret = 'YOUR_CLIENT_SECRET';

			// Request access token for user from FourSquare API
			var address = 'foursquare.com';
    		var params = '?client_id=' + clientID + '&client_secret=' + clientSecret + '&grant_type=authorization_code&redirect_uri=' + redirectURI + '&code=' + code;
			var path = '/oauth2/access_token' + params;

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
					
					var responseBody = JSON.parse(data);

					log += 'RESPONSE RECEIVED' + os.EOL;
					log += 'STATUS: ' + res.statusCode + os.EOL;
					log += 'DATA: ' + data + os.EOL;

					appendToFile(log, function(err) {

						if(res.statusCode == 200)
							updateUserWithToken(username, data.access_token);

					});

				});

			});

			req.on('error', function(err) {
				
				log += '***** ERROR OCCURRED DURING REQUEST *****' + os.EOL;
				log += JSON.stringify(err) + os.EOL;
				appendToFile(log, function(err) {});

			});

			req.end();

		});

	});

}



exports.get = function(req, res, username) {

	if(!req.query.code) {

		res.status(500);
		res.send('No code query parameter was found');		

	} else if(!username) {

		res.status(400);
		res.send('Incorrect cookie; username was not found');

	} else {

		res.render('../views/pages/code');
		// Update the access code temporarily so the FS link doesn't show up
		updateUserWithToken(username, 'temp');
		exchangeCode(req.query.code, username);

	}

}