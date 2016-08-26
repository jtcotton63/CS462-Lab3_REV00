function parseCookie(cookies) {

	if(cookies && cookies.session)

		return cookies.session;

	else

		return null;

}



exports.getCookie = function(req, res, callback) {

	var username = parseCookie(req.cookies);

	if(username)

		callback(req, res, username);

	else

		callback(req, res, null);

};