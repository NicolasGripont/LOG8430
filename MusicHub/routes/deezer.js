var express = require('express');
var request = require('request');
var querystring = require('querystring');

var router = express.Router();

var app_id = '258882';
var secret_key = '365da85ce2d14d1f33838cdc1c6699e4';
var sign_in_uri = 'http://localhost:3000/deezer/loggedin';

router.get('/login', function(req, res, next) {
    // your application requests authorization
    res.redirect('https://connect.deezer.com/oauth/auth.php?' +
        querystring.stringify({
            app_id: app_id,
            redirect_uri: sign_in_uri,
            perms: "basic_access"
        }));
});

router.get('/loggedin', function(req, res, next) {

    // your application requests refresh and access tokens
    // after checking the state parameter
    var errorReason = req.param('error_reason');
    var code = req.param('code');

    console.log('code: ' + code);

    if(!errorReason) {
        var options = {
            url: 'https://connect.deezer.com/oauth/access_token.php?' +
                querystring.stringify({
                    app_id: app_id,
                    secret: secret_key,
                    code: code,
                    output: "json"
                }),
            json: true
        };

        console.log(options.url);

        request.get(options, function(error, response, body) {
            var accessToken = body.access_token;
            var expires = body.expires;

            console.log('accessToken: ' + accessToken);
            console.log('expires: ' + expires);

            res.redirect('/views/settings');
        });


    } else {
        console.log('error_reason:' + req.param('error_reason'));
    }

});


module.exports = router;
