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
            spotifyConfig.loginUrl, spotifyConfig.tokenUrl, spotifyConfig.scope);
    }

    connection(req, res, api, action) {
        if (validator.isIn(req.params.action, ["login", "loggedIn"])) {
            if(validator.isIn(api,['deezer', 'spotify'])) {
                switch (action) {
                    case 'login':
                        this.login(req,res,api);
                        break;
                    case 'loggedIn':
                        this.loggedIn(req,res,api);
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
        console.log("-> ConnectorController.loggedIn");
        this.connectors[api].loggedIn(req,res,this.succededLoggedIn,this.failedLoggedIn);
    }

    succededLoggedIn(req, res, settings) {
        console.log("-> ConnectorController.succededLoggedIn : " + settings);
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
}

module.exports = ConnectorController;