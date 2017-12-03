var express = require('express');
var connection = require('musichub-connection');
var connector = require('musichub-connector');
var playlist = require('musichub-playlist');
var config = require('../config.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    render(res,'musics', {
        title: 'Music Hub',
		activeLi: "Home", 
	});
});

router.get('/signup', function(req, res, next) {
    render(res,'user/signup', {
        title: 'Music Hub - Sign Up',
    });
});

router.get('/signin', function(req, res, next) {
    render(res,'user/signin', {
        title: 'Music Hub - Sign In',
    });
});

router.get('/settings', function(req, res, next) {
    render(res, 'settings/settings', {
        title: 'Music Hub - Settings',
    	activeLi: "Settings"
    });
});

function render(res, route, params) {
    params.connectorPort = connector.port;
    params.connectorHost = connector.host;
    params.connectionPort = connection.port;
    params.connectionHost = connection.host;
    params.playlistPort = playlist.port;
    params.playlistHost = playlist.host;
    params.viewPort = config.port;
    params.viewHost = config.host;
    res.render(route, params);
}

module.exports = router;
