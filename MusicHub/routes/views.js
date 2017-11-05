var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Music Hub', activeLi: "Home"} );
});

router.get('/signup', function(req, res, next) {
    res.render('user/signup', { title: 'Music Hub - Sign Up' } );
});

router.get('/signin', function(req, res, next) {
    res.render('user/signin', { title: 'Music Hub - Sign In' } );
});

router.get('/settings', function(req, res, next) {
    res.render('settings/settings', { title: 'Music Hub - Settings', activeLi: "Settings"} );
});

module.exports = router;
