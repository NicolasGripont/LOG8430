var SettingsDB = require('../models_db/modelSingleton').DbSettings;

/**
 * Represents the user api/platform Settings
 */
class Settings {

    /**
     * Constructor
     *
     * @param userEmail Email of the corresponding user
     */
    constructor(userEmail) {
        this._userEmail = userEmail;
    }

    /**
     * Create or update the user settings corresponding to plateform/api given in parameter
     *
     * @param platform     Platform/api name of the settings to save
     * @param apiSettings  Platform/api settings to save
     * @param cb           Function called when creation or update is done.
     *                     Called with a mongoose json object error if failed, null if success as parameter.
     */
    save(platform, apiSettings, cb) {
        var self = this;
        SettingsDB.find( { userEmail : self._userEmail }, function(err, settings) {
        	if(err) {
        		return cb(err);
        	}
            var setting;
            if(settings && settings.length && settings.length === 1) {
                setting = settings[0];
            } else {
                setting = new SettingsDB( {userEmail: self._userEmail});
            }
            setting[platform] = apiSettings;
            setting.save(function(error){
                return cb(error);
            });
        })
    }

    /**
     * Getter of the user email who own the settings
     *
     * @returns {*} The email
     */
    get userEmail() {
        return this._userEmail;
    }

}

/**
 * Export the Settings class
 * @type {User} Model class of the user Settings
 */
module.exports = Settings;