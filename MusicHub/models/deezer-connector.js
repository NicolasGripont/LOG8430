var request = require('request');
var queryString = require('querystring');
var Promise = require('promise');
var Music = require('../models/music');

/**
 * Define the Deezer Music API Connector Class
 * This class defines the connector whose purpose is to interact with the Deezer music API
 */
class DeezerConnector extends AbstractConnector {

    /**
     * Constructor
     *
     * @param appId       Application ID on http://developers.deezer.com/myapps
     * @param secretKey   Secret Key on http://developers.deezer.com/myapps
     * @param loginUrl    Deezer api login url
     * @param perms       Permissions asked to the user
     * @param tokenUrl    Deezer api token url
     */
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

    /**
     * Log the user on the corresponding Api
     *
     * @param req           Http request
     * @param res           Http response
     * @param redirectUri   Redirect Uri to redirect when the user has logged on the API
     */
    login(req, res, redirectUri) {
        res.redirect(this.loginUrl +
            queryString.stringify({
                app_id: this.appId,
                redirect_uri: redirectUri,
                perms: this.perms
            }));
    }

    /**
     * Method to use when the user has logged on the API. You should ask API parameters such as token
     * in this method
     *
     * @param req              Http request
     * @param res              Http response
     * @param successCallback  Function called when the connextion is successful.
     *                         Called with the req, res parameter and the json result.
     * @param errorCallback    Function called when the connextion is failed.
     *                         Called with the req, res parameter, the status code and the json result.
     */
    loggedIn(req, res, successCallback, errorCallback) {
        var self = this;
        var errorReason = req.param.error_reason;
        var code = req.params.code;

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

            request.get(options, function(error, response, body) {
                self.accessToken = body.access_token;
                self.expires = body.expires * 1000 + Date.now();

                var deezerSetting = {accessToken: self.accessToken, expires : self.expires};
                var settings = new Settings(req.session.email);
                settings.save("deezer", deezerSetting, function (error,result) {
                    if(error) {
                        errorCallback(req, res, 500, error);
                    } else {
                        successCallback(req, res, result);
                    }
                });
            });

        } else {
            errorCallback(req, res, 500, errorReason);
        }
    }

    /**
     * Log the user out of the corresponding Api
     *
     * @param req           Http request
     * @param res           Http response
     * @param successCallback  Function called when the log out is successful.
     *                         Called with the req, res parameter and the json result.
     * @param errorCallback    Function called when the log out is failed.
     *                         Called with the req, res parameter, the status code and the json result.
     */
    logout(req, res, successCallback, errorCallback) {
        var settings = new Settings(req.session.email);

        settings.save("deezer", undefined, function (error,result) {
            if(error) {
                errorCallback(req, res, 500, error);
            } else {
                successCallback(req, res, result);
            }
        });
    }

    /**
     * Set the connector settings
     *
     * @param settings Settings to set
     */
    //TODO Settings attribute better than set multiple attributes here
    setSettings(settings) {
        this.accessToken = settings.accessToken;
        this.expires = settings.expires;
    }

    /**
     * Search tracks corresponding on the title on the API
     *
     * @param query Query to search (keywords)
     */
    searchTracks(query) {
        var self = this;
        return new Promise(function(resolve, reject) {

                var options = {
                    url: "http://api.deezer.com/search/track?q=" + query,
                    json: true
                };
                request.get(options, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    var deezerTracks = result.body.data;
                    var tracks = self.formatTracks(deezerTracks);
                    return resolve(tracks);
                })
            }
        );
    }

    /**
     * Format the api json tracks in json Model.Music array
     *
     * @param apiTracks Api json tracks to format
     */
    formatTracks(apiTracks) {
        var tracks = [];
        for(var i = 0; i < apiTracks.length; i++) {
            var id = -1;
            var platform = "deezer";
            var title = "";
            var artists = [];
            var album = {}
            var duration = 0;
            var previewUrl = "";

            id = apiTracks[i].id;
            title = apiTracks[i].title;
            if(apiTracks[i].album) {
                album.name = apiTracks[i].album.title;
                album.artists = [];
            }
            if(apiTracks[i].artist) {
                artists.push({name:apiTracks[i].artist.name});
            }
            duration = apiTracks[i].duration * 1000;
            previewUrl = apiTracks[i].preview;

            const track = new Music(id, platform, title, artists, album, duration, previewUrl);

            tracks.push(track);
        }
        return tracks;
    }

    /**
     * Find track by id on the API
     *
     * @param id Id of the track to find
     */
    findTrack(id) {
    	var self = this;
        return new Promise(function(resolve, reject) {

                var options = {
                    url: "http://api.deezer.com/track/" + id,
                    json: true
                };
                request.get(options, function (error, result) {
                    if (error) {
                        return reject(error);
                    }
                    var body = result.body;
                    var tracks = self.formatTracks([body]);
                    return resolve(tracks[0]);
                })
            }
        );
    }
}

/**
 * Export the DeezerConnector class
 * @type {DeezerConnector} Model class of DeezerConnector
 */
module.exports = DeezerConnector;