var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user-controller');
var controller = new UserController();

router.post('/signup', function(req, res) {
	controller.createUser(req,res);
});

router.post('/signin', function(req, res) {
	controller.logIn(req,res);
});

router.get('/signout', function(req, res) {
	controller.logOut(req, res);
});

module.exports = router;
