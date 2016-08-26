exports.get = function(req, res, username) {

	var ownSpace = (username === req.params.user_id ? true : false);

	var name = ( ownSpace ? 'your' : req.params.user_id + '\'s');

    res.render('pages/profile', {
        name: name
    });
    
};