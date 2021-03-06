var mongoose = require('mongoose');



var UserSchema   = new mongoose.Schema(

	{
		// Username
		username: {
			type: String,
			unique: true,
			required: true
		},
		// Password
		password: {
			type: String,
			required: true
		},
		// Cookie representing this person
		cookie: {
			type: String,
			required: true
		},
		// FourSquare access token
		fs_access_token: {
			type: String
		}

	}

);



// Export as Mongoose model
module.exports = mongoose.model('User', UserSchema);