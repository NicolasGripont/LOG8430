/**
 * Created by Nico on 05/11/2017.
 */
var validator = require('validator');
var DeezerConnector = require('../models/deezer-connector');
var SpotifyConnector = require('../models/spotify-connector');
var config = require('../config.json');
var SettingDB = require('../models_db/settings');

class ConnectorController {
    constructor(){
        this.connectors = {};

        var deezerConfig = config.deezer;
        this.connectors['deezer'] = new DeezerConnector(deezerConfig.appId, deezerConfig.secretKey,
            deezerConfig.loginUrl, deezerConfig.perms, deezerConfig.tokenUrl);

        var spotifyConfig = config.spotify;
        this.connectors['spotify'] = new SpotifyConnector(spotifyConfig.clientId, spotifyConfig.clientSecret,
            spotifyConfig.loginUrl, spotifyConfig.tokenUrl, spotifyConfig.scope, spotifyConfig.searchUrl);
    }

    executeAction(req, res, api, action) {
        if (validator.isIn(req.params.action, ['login', 'loggedIn', 'logout'])) {
            if(validator.isIn(api,['deezer', 'spotify'])) {
                switch (action) {
                    case 'login':
                        this.login(req,res,api);
                        break;
                    case 'loggedIn':
                        this.loggedIn(req,res,api);
                        break;
                    case 'logout':
                        this.logout(req,res,api);
                        break;
                }
            } else {
                this.showError(req, res);
            }
        } else {
            this.showError(req, res);
        }
    }

    login(req, res, api) {
        this.connectors[api].login(req,res,req.protocol + '://' + req.get('host')
                +'/connector/connection/' + api + '/loggedIn');
    }

    loggedIn(req, res, api) {
        this.connectors[api].loggedIn(req,res,this.succededLoggedIn,this.failedLoggedIn);
    }

    logout(req, res, api) {
        this.connectors[api].logout(req,res,this.succededLoggedIn,this.failedLoggedIn);
    }

    succededLoggedIn(req, res, settings) {
        res.redirect('/views/settings');
    }

    failedLoggedIn(req, res, status, error) {
       this.showError(req,res);
    }

    showError(req, res) {
        res.redirect('/error');
    }

    sendSettings(req, res) {
        SettingDB.find( { userEmail : req.session.email }, function(err, settings) {
            if(settings && settings.length === 1) {
                var now = Date.now();
                if(settings.deezer && now >= settings.deezer.expires) {
                    settings.deezer = undefined;
                }

                if(settings.spotify && now >= settings.spotify.expires) {
                    settings.spotify = undefined;
                }
                res.json(settings[0]);
            } else {
                res.json({});
            }
        })
    }

    search(req, res, query) {
        var self = this;
        SettingDB.find( { userEmail : req.session.email }, function(err, settings) {
            if(settings && settings.length === 1) {
                var settings = settings[0];
                //TODO test token expiration date

                // if(settings.spotify) {
                //     self.connectors['spotify'].setSettings(settings.spotify);
                //     self.connectors['spotify'].searchTracks(query, function (error, response) {
                //         if(error) {
                //             return res.json({ error : error});
                //         }
                //         return res.json(response);
                //     });
                // }
                if(settings.deezer) {
                    self.connectors['deezer'].setSettings(settings.deezer);
                    self.connectors['deezer'].searchTracks(query, function (error, response) {
                        if(error) {
                            return res.json({ error : error});
                        }
                        return res.json(response);
                    });
                }


            } else {
                return res.json({});
            }
        })
    }
}

module.exports = ConnectorController;