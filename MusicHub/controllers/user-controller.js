var User = require('../models/user');

class UserController {
	constructor() {}

	createUser(req, res) {
		var email = req.body.email || "";
		var password = req.body.password || "";
		if(email === "" || password === "") {
			return res.status(400).json({message:"Bad Email or password."});
		}
		var newUser = new User(email,password);
		newUser.save(function(err) {
			if(err) {
				return res.status(400).json({message:"Email is already used by another user."});
			}
			res.status(200).json({message:"OK"});
		});
	}
	
	logIn(req, res) {
		var email = req.body.email || "";
		var password = req.body.password || "";
		var newUser = new User(email,password);
		if(email === "" || password === "") {
			return res.status(400).json({error:{message:"Bad email or password."}});
		}
		newUser.logIn(function(err,isFound){
			if(err) {
				return res.status(500).json({message:"Connection to database failed"});
			}
			if(isFound) {
				req.session.email = newUser.email;
				return res.status(200).json({message:"OK"});
			}
			return res.status(400).json({message:"Bad email or password."});
		});
	}
	
	logOut(req, res) {
        req.session.destroy(function(err) {
            if(err) {
            	if(err.message) {
                    return res.status(400).json({message:err.message});
				}
                return res.status(400).json({message:"Sign out error."});
            }
            res.status(200).json({message:"OK"});
        });
	}
}

module.exports = UserController;