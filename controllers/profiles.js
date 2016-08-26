exports.get = function(req, res, username) {

	var ownSpace = (username === req.params.username ? true : false);

	var name = ( ownSpace ? 'your' : req.params.username + '\'s');

    res.render('pages/profile', {
        name: name
    });
    
};