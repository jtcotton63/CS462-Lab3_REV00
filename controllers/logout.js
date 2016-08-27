exports.get = function(req, res) {

	res.clearCookie('session');
	res.redirect('/login');

};