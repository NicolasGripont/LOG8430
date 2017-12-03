var DbUser = require('../models_db/modelSingleton').DbUser;

/**
 * Represents the application User.
 */
class User {
    /**
     * Constructor.
     *
     * @param email     Email of the user
     * @param password  Corresponding password
     */
	constructor(email, password) {
		this._email = email;
		this._password = password;
		this._token = undefined;
		this._expires = undefined;
	}

    /**
     * Connect the user, check if the current user exist in database.
     *
     * @param cb   Function called when existance in database of the current user is checked.
     *             Called with true if user exists in database, else false as parameter.
     */
	logIn(cb) {
		DbUser.find({email:this.email, password:this.password}, function(err, foundUser) {
			if(err) {
				return cb(err);
			}
			return cb(null, foundUser.length  === 1);
		});
	}

    /**
     * Create the user in database.
     *
     * @param cb   Function called when the current user is created in database.
     *             Called with a mongoose json object error if failed, null if success as parameter.
     */
	save(cb) {
		var dbU = new DbUser({
			email : this.email,
			password : this.password
		});
		dbU.save(function (err) {
			return cb(err);
		});
	}

    /**
     * Getter of the user email.
     *
     * @returns {*} The email
     */
	get email() {
		return this._email;
	}

    /**
     * Getter of the user password.
     *
     * @returns {*} The password
     */
	get password() {
		return this._password;
	}

    /**
     * Getter of the user token.
     *
     * @returns {*} The token
     */
    get token() {
        return this._token;
    }

    /**
     * Getter of the user token expiration date.
     *
     * @returns {*} The expiration date
     */
    get expires() {
        return this._expires;
    }


    /**
     * Getter of the user token.
     *
     * @returns {*} The token
     */
    set token(value) {
		this._email = value;
    }

    /**
     * Getter of the user token expiration date.
     *
     * @returns {*} The expiration date
     */
    set expires(value) {
		this._expires = value;
    }
}

/**
 * Export the User class
 * @type {User} Model class of the user of the application
 */
module.exports = User;