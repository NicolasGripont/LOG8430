/**
 * Created by Nico on 05/11/2017.
 */

var request = require('request');
var queryString = require('querystring');
var AbstractConnector = require('./abstract-connector');
var Settings = require('../models/settings');
var Promise = require('promise');
var Music = require('../models/music');

class SpotifyConnector extends AbstractConnector {

    //TODO object parameter : cf cours de clean code
    constructor(clientId,clientSecret,loginUrl,tokenUrl,scope, searchUrl){
        super();
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.loginUrl = loginUrl;
        this.tokenUrl = tokenUrl;
        this.scope = scope;
        this.searchUrl = searchUrl;
        this.accessToken = undefined;
        this.refreshToken = undefined;
        this.expires = undefined;
    }

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

    setSettings(settings) {
        this.accessToken = settings.accessToken;
        this.refreshToken = settings.refreshToken;
        this.expires = settings.expires;
    }

    searchTracks(title) {
        var self = this;
        return new Promise(function(resolve, reject) {
            var options = {
                url: "https://api.spotify.com/v1/search?"+
                    queryString.stringify({q : title, type : "track"}),
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

    formatTracks(spotifyTracks) {
        var tracks = [];
        for(var i = 0; i < spotifyTracks.length; i++) {
            var id = -1;
            var platform = "spotify";
            var title = "";
            var artists = [];
            var album = {};
            var duration = 0;
            var previewUrl = "";


            id = spotifyTracks[i].id;
            title = spotifyTracks[i].name;
            if(spotifyTracks[i].album) {
            	album.name = spotifyTracks[i].album.name;
            	album.artists = [];
            }
            if(spotifyTracks[i].artists) {
                for(var j = 0; j < spotifyTracks[i].artists.length; j++) {
                    artists.push({name:spotifyTracks[i].artists[j].name});
                }
            }
            duration = spotifyTracks[i].duration_ms;
            previewUrl = spotifyTracks[i].preview_url;

            const track = new Music(id, platform, title, artists, album, duration, previewUrl);

            tracks.push(track);
        }
        return tracks;
    }
    
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