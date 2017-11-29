var SettingsDB = require('../models_db/modelSingleton').DbSettings;

class Settings {
    constructor(userEmail) {
        this._userEmail = userEmail;
    }

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

    get userEmail() {
        return this._userEmail;
    }

}

module.exports = Settings;