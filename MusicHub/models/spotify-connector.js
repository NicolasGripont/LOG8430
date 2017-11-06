var request = require('request');
var querystring = require('querystring');
var AbstractConnector = require('./abstract-connector');

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

    loggedIn(req, res, redirectUri) {
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

    searchMusics(title) {
    }
}

module.exports = SpotifyConnector;