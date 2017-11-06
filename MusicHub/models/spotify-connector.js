var request = require('request');
var querystring = require('querystring');
var AbstractConnector = require('./abstract-connector');

class SpotifyConnector extends AbstractConnector {

    constructor(){
        super();
        this.stateKey = 'spotify_auth_state';
        this.clientId = '2ab39fd6978c49869a1f06409fae1a54';
        this.clientSecret = '50a9b3a41817406da7976a236d25afea';
        this.redirectUri = 'http://localhost:3000/connector/connection/spotify/loggedIn';
        this.tokenUri = 'https://accounts.spotify.com/api/token';
        
        this.accessToken = undefined;
        this.refreshToken = undefined;
        this.expires = undefined;
    }

    generateRandomString(length) {
        var text = '';
        var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (var i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
        return text;
    };

    login(req, res) {
        var state = this.generateRandomString(16);
        res.cookie(this.stateKey, state);

        var scope = 'user-read-private user-read-email';
        res.redirect('https://accounts.spotify.com/authorize?' +
            querystring.stringify({
                response_type: 'code',
                client_id: this.clientId,
                scope: scope,
                redirect_uri: this.redirectUri,
                state: state
            }));
    }

    loggedIn(req, res, redirectUri) {
        var self = this;
        var code = req.query.code || null;
        var state = req.query.state || null;
        var storedState = req.cookies ? req.cookies[this.stateKey] : null;

        if (state === null || state !== storedState) {
            res.redirect('/views/settings?' +
                querystring.stringify({
                    error: 'state_mismatch'
                }));
        } else {
            res.clearCookie(this.stateKey);
            var authOptions = {
                url: this.tokenUri,
                form: {
                    code: code,
                    redirect_uri: this.redirectUri,
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
                    self.expires = body.expires_in;

                    console.log('access_token: ' + self.accessToken);
                    console.log('refresh_token: ' + self.refreshToken);
                    console.log('expires_in: ' + self.expires);

                    res.redirect('/views/settings');
                } else {
                    res.redirect('/views/settings');
                }
            });
        }
    }

    searchMusics(title) {
    }
}

module.exports = SpotifyConnector;