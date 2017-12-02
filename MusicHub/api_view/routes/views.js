var express = require('express');
var connection = require('musichub-connection');
var connector = require('musichub-connector');
var playlist = require('musichub-playlist');
var config = require('../config.json');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('musics', { title: 'Music Hub',
		activeLi: "Home", 
		connectorPort:connector.port,
		connectorHost:connector.host,
		connectionPort:connection.port,
		connectionHost:connection.host,
		playlistPort:playlist.port,
		playlistHost:playlist.host,
        viewPort:config.port,
        viewHost:config.host
	});
});

router.get('/signup', function(req, res, next) {
    res.render('user/signup', { title: 'Music Hub - Sign Up',
        connectorPort:connector.port,
        connectorHost:connector.host,
        connectionPort:connection.port,
        connectionHost:connection.host,
        playlistPort:playlist.port,
        playlistHost:playlist.host,
        viewPort:config.port,
        viewHost:config.host
    });
});

router.get('/signin', function(req, res, next) {
    res.render('user/signin', { title: 'Music Hub - Sign In',
        connectorPort:connector.port,
        connectorHost:connector.host,
        connectionPort:connection.port,
        connectionHost:connection.host,
        playlistPort:playlist.port,
        playlistHost:playlist.host,
        viewPort:config.port,
        viewHost:config.host
	});
});

router.get('/settings', function(req, res, next) {
    res.render('settings/settings', { title: 'Music Hub - Settings',
    	activeLi: "Settings",
        connectorPort:connector.port,
        connectorHost:connector.host,
        connectionPort:connection.port,
        connectionHost:connection.host,
        playlistPort:playlist.port,
        playlistHost:playlist.host,
        viewPort:config.port,
        viewHost:config.host
	});
});

module.exports = router;
