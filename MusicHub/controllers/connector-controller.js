var validator = require('validator');
var modelSingleton = require('../models/modelsSingleton');
var DeezerConnector = modelSingleton.DeezerConnector;
var SpotifyConnector = modelSingleton.SpotifyConnector;
var config = require('../config.json');
var SettingDB = require('../models_db/modelSingleton').DbSettings;
var Promise = require('promise');


/**
 * Define Connector Controller for MVC.
 */
class ConnectorController {

    /**
     * Constructor
     */
    constructor(){
        this.connectors = {};

        var deezerConfig = config.deezer;
        this.connectors['deezer'] = new DeezerConnector(deezerConfig.appId, deezerConfig.secretKey,
            deezerConfig.loginUrl, deezerConfig.perms, deezerConfig.tokenUrl);

        var spotifyConfig = config.spotify;
        this.connectors['spotify'] = new SpotifyConnector(spotifyConfig.clientId, spotifyConfig.clientSecret,
            spotifyConfig.loginUrl, spotifyConfig.tokenUrl, spotifyConfig.scope);
    }

    /**
     * Call the  action ('login' or 'loggedIn' or 'logout') of the connector corresponding to the api parameter.
     * If success, call 'login' or 'loggedIn' or 'logout' method of connector.
     * If fail, call the method this.showError.
     *
     * @param req      Http request
     * @param res      Http response
     * @param api      API name to request
     * @param action   Action to do on connector : 'login' or 'loggedIn' or 'logout'
     */
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

    /**
     * Call the api connector 'login' method.
     *
     * @param req      Http request
     * @param res      Http response
     * @param api      API name to request
     */
    login(req, res, api) {
        this.connectors[api].login(req,res,req.protocol + '://' + req.get('host')
                +'/connector/connection/' + api + '/loggedIn');
    }

    /**
     * Call the api connector 'loggedIn' method.
     *
     * @param req      Http request
     * @param res      Http response
     * @param api      API name to request
     */
    loggedIn(req, res, api) {
        //TODO refactor (only one callback)
        this.connectors[api].loggedIn(req,res,this.succededLoggedIn,this.failedLoggedIn);
    }

    /**
     * Call the api connector 'logout' method.
     *
     * @param req      Http request
     * @param res      Http response
     * @param api      API name to request
     */
    logout(req, res, api) {
        //TODO refactor (only one callback)
        this.connectors[api].logout(req,res,this.succededLoggedIn,this.failedLoggedIn);
    }

    /**
     * Redirect the client to the /views/settings route.
     *
     * @param req      Http request
     * @param res      Http response
     */
    succededLoggedIn(req, res) {
        res.redirect('/views/settings');
    }

    /**
     * Called the method this.showError (error callback method).
     *
     * @param req      Http request
     * @param res      Http response
     * @param status   Status code of the error
     * @param error    Json error
     */
    failedLoggedIn(req, res, status, error) {
       this.showError(req,res);
    }

    /**
     * Redirect the client to the /error route
     *
     * @param req      Http request
     * @param res      Http response
     */
    showError(req, res) {
        res.redirect('/error');
    }

    /**
     * Send the user/client settings to the user/client.
     * If success, send settings as json object with the status code 200.
     * If fail or no settings, send an empty json with the status code 200.
     *
     * @param req      Http request
     * @param res      Http response
     */
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

    /**
     * Send the tracks correspond to the query.
     * The tracks or given as json object { apiName : [coresponding Model.Music array], ...}.
     * If success, send the tracks as json object with the status code 200.
     * If fail or no settings, send an empty json with the status code 200.
     *
     * @param req      Http request
     * @param res      Http response
     * @param query    Query, keywords to search
     */
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


    /**
     * Find the track corresponding to the id and platform/api given as parameter.
     *
     * @param id         ID of the track to find
     * @param platform   Platform/api of the track to find
     * @param email      Email of the user the current user
     * @param cb         Function called when the track is found or if fail.
     *                   Called with a error and null parameter if fail or null and track if success.
     */
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

/**
 * Export the ConnectorController class
 * @type {ConnectorController} Controller class of ConnectorController
 */
module.exports = ConnectorController;