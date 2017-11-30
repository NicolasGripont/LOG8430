var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user-controller');
var controller = new UserController();

/**
 * Create an User account
 */
router.post('/signup', function(req, res) {
	controller.createUser(req,res);
});


/**
 * Connect the User
 *
 * req.session.email : is defined if success
 */
router.post('/signin', function(req, res) {
	controller.logIn(req,res);
});


/**
 * Disconnect the User
 *
 * req.session : is destroyed if success
 */
router.get('/signout', function(req, res) {
	controller.logOut(req, res);
});

module.exports = router;
