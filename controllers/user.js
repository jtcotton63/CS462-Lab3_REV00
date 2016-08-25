exports.get = function(req, res) {

	var name = req.params.user_id + '\'s';

    res.render('pages/profile', {
        name: name
    });
    
};