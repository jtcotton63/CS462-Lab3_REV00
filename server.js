var bodyParser = require('body-parser');
var cookieController = require('./controllers/cookie');
var cookieParser = require('cookie-parser');
var express = require('express');
var loginController = require('./controllers/login');
var logoutController = require('./controllers/logout');
var mainController = require('./controllers/main');
var mongoose = require('mongoose');
var userController = require('./controllers/user');
var usersController = require('./controllers/users');



// Connect to mongoDB
mongoose.connect('mongodb://localhost:27017/cs462-lab3-rev00');



// Create the express application
var app = express();



// Set the view engine
app.set('view engine', 'ejs');



// Configure body-parser
app.use(bodyParser.urlencoded({
  extended: true
}));



// Configure cookie-parser
app.use(cookieParser());



// Configure router
var router = express.Router();

router.get('/', function(req, res) {
	cookieController.getCookie(req, res, mainController.get);
});

router.route('/login')
	.get(loginController.get);

router.route('/logout')
	.get(logoutController.get);

router.route('/users')
	.get(usersController.get)
	.post(usersController.post);

router.get('/users/:user_id', function(req, res) {
	cookieController.getCookie(req, res, userController.get);
});

app.use('/', router);




// Start the app
app.listen(3000);
console.log('Server started');