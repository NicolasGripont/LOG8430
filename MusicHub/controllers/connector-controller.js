/**
 * Created by Nico on 05/11/2017.
 */
var validator = require('validator');
var DeezerConnector = require('../models/deezer-connector');
var SpotifyConnector = require('../models/spotify-connector');
var config = require('../config.json');


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
        this.connectors[api].loggedIn(req,res,'/views/settings');
    }

    showError(req, res) {
        //TODO
    }
}

module.exports = ConnectorController;