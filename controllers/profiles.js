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

			var fsLink = 'https://foursquare.com/oauth2/authenticate?client_id=CLIENT_ID&response_type=code&redirect_url=REDIRECT';
			var link = (ownSpace ? fsLink : null);

		    res.render('pages/profile', {
		        link: link,
		        name: name
		    });

		}

	});
    
};