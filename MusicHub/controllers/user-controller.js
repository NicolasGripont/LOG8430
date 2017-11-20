var User = require('../models/user');

class UserController {
	constructor() {}
	
	createUser(req, res) {
		var email = req.body.email || "";
		var password = req.body.password || "";
		if(email === "" || password === "") {
			return res.status(200).json({error:"Bad Email or password"});
		}
		var newUser = new User(email,password);
		newUser.save(function(err) {
			if(err) {
				return res.status(200).json({error:"Email is already used by another User"});
			}
			res.status(200).json({ok:"ok"});
		});
	}
	
	logIn(req, res, cb) {
		var email = req.body.email || "";
		var password = req.body.password || "";
		var newUser = new User(email,password);
		if(email === "" || password === "") {
			return res.json("bad email or password");
		}
		newUser.logIn(function(isFound){
			if(isFound) {
				req.session.email = newUser.email;
				return res.status(200).json({ok:"ok"});
			}
			return res.json({error:"bad email or password"});
		});
	}
	
	logOut(req, res) {
        req.session.destroy(function(err) {
            if(err) {
                console.log(err);
                return res.json({error:err});
            }
            res.status(200).json({ok:"ok"});
        });
	}
}

module.exports = UserController;