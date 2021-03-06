var bodyParser = require('body-parser');
var codeController = require('./controllers/code');
var connectController = require('./controllers/connect');
var cookieController = require('./controllers/cookie');
var cookieParser = require('cookie-parser');
var express = require('express');
var fs = require('fs');
var https = require('https');
var loginController = require('./controllers/login');
var logoutController = require('./controllers/logout');
var mainController = require('./controllers/main');
var mongoose = require('mongoose');
var profilesController = require('./controllers/profiles');
var userController = require('./controllers/user');
var usersController = require('./controllers/users');



// Connect to mongoDB
mongoose.connect('mongodb://localhost:27017/cs462-lab3-rev00');



// Create the express application
var app = express();



// Set the view engine
app.set('view engine', 'ejs');



// Configure body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));



// Configure cookie-parser
app.use(cookieParser());



// Configure router
var router = express.Router();

// Standard routes

router.get('/', function(req, res) {
	cookieController.getUsernameForCookie(req, res, mainController.get);
});

router.get('/code', function(req, res) {
	cookieController.getUsernameForCookie(req, res, codeController.get);
});

router.get('/connect', function(req, res) {
	cookieController.getUsernameForCookie(req, res, connectController.get);
});

router.route('/login')
	.get(loginController.get);

router.route('/logout')
	.get(logoutController.get);

router.get('/profiles/:username', function(req, res) {
	cookieController.getUsernameForCookie(req, res, profilesController.get);
});

// API routes

router.get('/api/users', function(req, res) {
	cookieController.getAdminUsernameForCookie(req, res, usersController.get);
});

router.route('/api/users').post(usersController.post);

router.put('/api/users/:username', function(req, res) {
	cookieController.getAdminUsernameForCookie(req, res, userController.put);
});

app.use('/', router);




// Configure HTTPS

var cert = fs.readFileSync('/home/josephee/.ssh/localhosthttpscert.pem');
var key = fs.readFileSync('/home/josephee/.ssh/joseph-private-key.pem');
var httpsOptions = {
	
	key: key,
	cert: cert

};



// Start the app
server = https.createServer(httpsOptions, app).listen(3000);
console.log('Server started');