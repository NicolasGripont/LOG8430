var request = require('request');
var queryString = require('querystring');
var Promise = require('promise');
var AbstractConnector = require('./abstract-connector');
var modelsRequireMusicSettings = require('./modelsRequireMusicSettings');
var Settings = modelsRequireMusicSettings.Settings;
var Music = modelsRequireMusicSettings.Music;

class SpotifyConnector extends AbstractConnector {


    /**
     * Constructor
     *
     * @param clientId       Client ID of application on https://beta.developer.spotify.com/dashboard/applications
     * @param clientSecret   Client Secret of application on https://beta.developer.spotify.com/dashboard/applications
     * @param loginUrl       Spotify API login URL
     * @param tokenUrl       Spotify API token URL
     * @param scope          Permission asked
     * @param searchUrl      Spotify Search URL
     */
    //TODO object parameter : cf cours de clean code
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

    /**
     * Log the user on the corresponding Api
     *
     * @param req           Http request
     * @param res           Http response
     * @param redirectUri   Redirect Uri to redirect when the user has logged on the API
     */
    login(req, res, redirectUri) {
        var scope = 'user-read-private user-read-email';
        res.redirect(this.loginUrl +
            queryString.stringify({
                response_type: 'code',
                client_id: this.clientId,
                scope: this.scope,
                redirect_uri: redirectUri
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

                var spotifySettings = {accessToken: self.accessToken, refreshToken : self.refreshToken, expires : self.expires};
                var settings = new Settings(req.session.email);
                settings.save("spotify", spotifySettings, function (error,result) {
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

        settings.save("spotify", undefined, function (error,result) {
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
        this.refreshToken = settings.refreshToken;
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
                url: "https://api.spotify.com/v1/search?"+
                    queryString.stringify({q : query, type : "track"}),
                json: true,
                headers: {Authorization: "Bearer "+self.accessToken}
            };
            request.get(options, function (error, result) {
                if (error) {
                    return reject(error);
                }

                var tracks = [];
                if(result.body.tracks && result.body.tracks.items) {
                    var spotifyTracks = result.body.tracks.items;
                    tracks = self.formatTracks(spotifyTracks);
                }

                return resolve(tracks);
            })
        });
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
            var platform = "spotify";
            var title = "";
            var artists = [];
            var album = {};
            var duration = 0;
            var previewUrl = "";


            id = apiTracks[i].id;
            title = apiTracks[i].name;
            if(apiTracks[i].album) {
            	album.name = apiTracks[i].album.name;
            	album.artists = [];
            }
            if(apiTracks[i].artists) {
                for(var j = 0; j < apiTracks[i].artists.length; j++) {
                    artists.push({name:apiTracks[i].artists[j].name});
                }
            }
            duration = apiTracks[i].duration_ms;
            previewUrl = apiTracks[i].preview_url;

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
                url: "https://api.spotify.com/v1/tracks/" + id,
                json: true,
                headers: {Authorization: "Bearer "+self.accessToken}
            };
            request.get(options, function (error, result) {
                if (error) {
                    return reject(error);
                }
                var body = result.body;
                var tracks = self.formatTracks([body]);
                return resolve(tracks[0]);
            })
       });
    }

}

module.exports = SpotifyConnector;