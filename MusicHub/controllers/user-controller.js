var User = require('../models/user');

/**
 * Define User Controller for MVC
 */
class UserController {

	/**
	 * Constructor
     */
	constructor() {}

    /**
     * Create a user in DB.
     * If success, send an OK json message with the status code 200
     * If fail, send an error json message with the status code 400
     *
     * @param req  Http request
     * @param res  Http response
     */
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

    /**
     * Log in the user. Add the user email to the req.session.email if success.
     * If success, send an OK json message with the status code 200
     * If fail, send an error json message with the status code 400
     *
     * @param req  Http request
     * @param res  Http response
     */
	logIn(req, res) {
		var email = req.body.email || "";
		var password = req.body.password || "";
		var newUser = new User(email,password);
		if(email === "" || password === "") {
			return res.status(400).json({message:"Bad email or password."});
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

    /**
     * Log out the user. Destroy the req/session.
     * If success, send an OK json message with the status code 200
     * If fail, send an error json message with the status code 400
     *
     * @param req  Http request
     * @param res  Http response
     */
	logOut(req, res) {
        req.session.destroy(function(err) {
            if(err) {
                return res.status(400).json({message:"Sign out error."});
            }
            res.status(200).json({message:"OK"});
        });
	}
}

/**
 * Export the UserController class
 * @type {UserController} Controller class UserController
 */
module.exports = UserController;