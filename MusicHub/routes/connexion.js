var express = require('express');
var router = express.Router();
var UserController = require('../controllers/user-controller');

router.post('/signup', function(req, res, next) {
	var email = req.body.email || "";
	var password = req.body.password || "";
	if(email === "" || password === "") {
		return res.status(200).json({error:"Bad Email or password"});
	}
	var newUser = new user({
		email : email,
		password : password
	});
	newUser.save(function (err) {
		if(err) {
			return res.status(200).json({error:"Email is already used by another User"});
		}
		res.status(200).json({ok:"ok"});
	});
});

router.post('/signin', function(req, res, next) {
	var controller = new UserController();
	controller.logIn(req,res);
});

router.get('/signout', function(req, res) {
	var controller = new UserController();
	controller.logOut(req, res);
});

module.exports = router;
