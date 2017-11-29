var SettingsDB = require('../models_db/modelSingleton').DbSettings;

class Settings {
    constructor(userEmail) {
        this._userEmail = userEmail;
    }

    save(platform, apiSettings, cb) {
        var self = this;
        SettingsDB.find( { userEmail : self._userEmail }, function(err, settings) {
            var setting;
            if(settings && settings.length && settings.length == 1) {
                setting = settings[0];
            } else {
                setting = new SettingsDB( {userEmail: self._userEmail});
            }
            switch (platform){
                case "spotify":
                    setting.spotify = apiSettings;
                    break;
                case "deezer":
                    setting.deezer = apiSettings;
                    break;
            }

            setting.save(function(error, result){
                return cb(error,result);
            });
        })
    }

    get userEmail() {
        return this._userEmail;
    }

}

module.exports = Settings;