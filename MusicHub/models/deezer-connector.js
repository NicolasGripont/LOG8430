/**
 * Created by Nico on 05/11/2017.
 */

var request = require('request');
var queryString = require('querystring');
var AbstractConnector = require('./abstract-connector');
var SettingDB = require('../models_db/settings');

class DeezerConnector extends AbstractConnector{

    constructor(appId, secretKey, loginUrl, perms, tokenUrl){
        super();
        this.appId = appId;
        this.secretKey = secretKey;
        this.loginUrl = loginUrl;
        this.perms = perms;
        this.tokenUrl = tokenUrl;
        this.accessToken = undefined;
        this.expires = undefined;
    }

    login(req, res, redirectUri) {
        console.log("DeezerConnector : " + redirectUri);
        res.redirect(this.loginUrl +
            queryString.stringify({
                app_id: this.appId,
                redirect_uri: redirectUri,
                perms: this.perms
            }));
    }

    loggedIn(req, res, successCallback, errorCallback) {
        var self = this;
        var errorReason = req.param('error_reason');
        var code = req.param('code');

        if(!errorReason) {
            var options = {
                url: this.tokenUrl +
                queryString.stringify({
                    app_id: this.appId,
                    secret: this.secretKey,
                    code: code,
                    output: "json"
                }),
                json: true
            };

            console.log(options.url);

            request.get(options, function(error, response, body) {
                self.accessToken = body.access_token;
                self.expires = body.expires;

                SettingDB.find( { userEmail : req.session.email }, function(err, settings) {
                    var setting;
                    if(settings && settings.length && settings.length == 1) {
                        setting = settings[0];
                    } else {
                        setting = new SettingDB( {userEmail: req.session.email});
                    }
                    setting.deezer = {accessToken: self.accessToken, expires : self.expires};
                    setting.save(function(error, result){
                        if(error) {
                            errorCallback(req, res, 500, error);
                        } else {
                            successCallback(req, res, result);
                        }
                    });
                })
            });

        } else {
            errorCallback(req, res, 500, errorReason);
        }
    }

    searchMusics(title) {
    }
}

module.exports = DeezerConnector;