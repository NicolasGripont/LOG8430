/**
 * Created by Nico on 05/11/2017.
 */
var validator = require('validator');
var DeezerConnector = require('../models/deezer-connector');
var SpotifyConnector = require('../models/spotify-connector');
var config = require('../config.json');
var SettingDB = require('../models_db/settings');
var Promise = require('promise');

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
        //TODO refactor (only one callback)
        this.connectors[api].loggedIn(req,res,this.succededLoggedIn,this.failedLoggedIn);
    }

    logout(req, res, api) {
        //TODO refactor (only one callback)
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
                res.status(200).json(settings[0]);
            } else {
                res.status(200).json({});
            }
        })
    }

    search(req, res, query) {
        var self = this;
        SettingDB.find( { userEmail : req.session.email }, function(err, settings) {
            if(settings && settings.length === 1) {
                var settings = settings[0];
                //TODO test token expiration date
                if(settings.spotify) {
                    self.connectors['spotify'].setSettings(settings.spotify);
                }
                if(settings.deezer) {
                    self.connectors['deezer'].setSettings(settings.deezer);
                }
                return Promise.all([self.connectors['spotify'].searchTracks(query), self.connectors['deezer'].searchTracks(query)])
                .then(function(tracks){
                    // 'articles' is now an array w/ results of all 'processFeed' calls
                    // do something with all the results...
                    var result = {};
                    result.spotify = tracks[0];
                    result.deezer = tracks[1];
                    return res.status(200).json(result);
                })
                .catch(function(error){
                    return res.status(400).json({ message : "Error when search on APIs."});
                })

            } else {
                return res.status(200).json({});
            }
        })
    }
    
    findTrack(id, platform, email, cb) {
    	var self = this;
    	SettingDB.find( { userEmail : email }, function(err, settings) {
    		if(!settings || settings.length !== 1) {
            	 return cb({message:"No settings"});
			} 		
			var settings = settings[0];
			self.connectors[platform].setSettings(settings[platform]);
			var requestSong = self.connectors[platform].findTrack(id); 
			requestSong.then(function(track){
			    return cb(null,track);
			})
			.catch(function(error){
			     return cb(error);
			});
    	});
    }

}

module.exports = ConnectorController;