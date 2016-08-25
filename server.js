var express = require('express');
var loginController = require('./controllers/login');
var logoutController = require('./controllers/logout');
var mainController = require('./controllers/main');
var userController = require('./controllers/user');



// Create the express application
var app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');

// Configure router
var router = express.Router();

// index page 
router.route('/')
	.get(mainController.get);

// login page 
router.route('/login')
	.get(loginController.get);

// login page
router.route('/logout')
	.get(logoutController.get);

// profile page 
router.route('/users/:user_id')
	.get(userController.get);

app.use('/', router);

app.listen(3000);
console.log('Server started');