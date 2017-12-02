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
		"connector-port":connector.port,
		"connector-host":connector.host,
		"connection-port":connection.port,
		"connection-host":connection.host,
		"playlist-port":playlist.port,
		"playlist-host":playlist.host,
        "view-port":config.port,
        "view-host":config.host
	});
});

router.get('/signup', function(req, res, next) {
    res.render('user/signup', { title: 'Music Hub - Sign Up',
    	"connector-port":connector.port,
		"connector-host":connector.host,
		"connection-port":connection.port,
		"connection-host":connection.host,
		"playlist-port":playlist.port,
		"playlist-host":playlist.host,
		"view-port":config.port,
        "view-host":config.host
    });
});

router.get('/signin', function(req, res, next) {
    res.render('user/signin', { title: 'Music Hub - Sign In',
    	"connector-port":connector.port,
		"connector-host":connector.host,
		"connection-port":connection.port,
		"connection-host":connection.host,
		"playlist-port":playlist.port,
		"playlist-host":playlist.host,
        "view-port":config.port,
        "view-host":config.host
	});
});

router.get('/settings', function(req, res, next) {
    res.render('settings/settings', { title: 'Music Hub - Settings',
    	activeLi: "Settings",
    	"connector-port":connector.port,
		"connector-host":connector.host,
		"connection-port":connection.port,
		"connection-host":connection.host,
		"playlist-port":playlist.port,
		"playlist-host":playlist.host,
        "view-port":config.port,
        "view-host":config.host
	});
});

module.exports = router;
