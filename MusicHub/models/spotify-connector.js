var request = require('request');
var querystring = require('querystring');
var AbstractConnector = require('./abstract-connector');
var SettingDB = require('../models_db/settings');

class SpotifyConnector extends AbstractConnector {

    constructor(clientId,clientSecret,loginUrl,tokenUrl,scope){
        super();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.loginUrl = loginUrl;
        this.tokenUrl = tokenUrl;
        this.scope = scope;
        this.accessToken = undefined;
        this.refreshToken = undefined;
        this.expires = undefined;
    }

    login(req, res, redirectUri) {
        var scope = 'user-read-private user-read-email';
        res.redirect(this.loginUrl +
            querystring.stringify({
                response_type: 'code',
                client_id: this.clientId,
                scope: this.scope,
                redirect_uri: redirectUri
            }));
    }

    loggedIn(req, res, successCallback, errorCallback) {
        var self = this;
        var code = req.query.code || null;
        var authOptions = {
            url: this.tokenUrl,
            form: {
                code: code,
                redirect_uri: req.protocol + '://' + req.get('host') + req.baseUrl + req.path,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(this.clientId + ':' + this.clientSecret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error, response, body) {
            if (!error && response.statusCode === 200) {
                self.accessToken = body.access_token;
                self.refreshToken = body.refresh_token;
                self.expires = body.expires_in * 1000 + Date.now();

                self.saveToken(req,res,function (error,result) {
                    if(error) {
                        errorCallback(req, res, 500, error);
                    } else {
                        successCallback(req, res, result);
                    }
                });
            } else {
                errorCallback(req, res, response.statusCode,error);
            }
        });
    }

    saveToken(req, res, cb) {
        var self = this;
        SettingDB.find( { userEmail : req.session.email }, function(err, settings) {
            var setting;
            if(settings && settings.length && settings.length == 1) {
                setting = settings[0];
            } else {
                setting = new SettingDB( {userEmail: req.session.email});
            }
            setting.spotify = {accessToken: self.accessToken, refreshToken : self.refreshToken, expires : self.expires};
            setting.save(function(error, result){
                return cb(error,result);
            });
        })
    }

    searchMusics(title) {
    }
}

module.exports = SpotifyConnector;