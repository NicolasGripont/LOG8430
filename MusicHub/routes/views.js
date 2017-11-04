var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Music Hub' });
});

router.get('/signup', function(req, res, next) {
    res.render('user/signup', {  title: 'Sign Up', layout: 'simple-layout' } );
});

router.get('/signin', function(req, res, next) {
    res.render('user/signin', {  title: 'Sign In', layout: 'simple-layout' } );
});

router.get('/settings', function(req, res, next) {
    res.render('settings/settings', {  title: 'Settings', layout: 'settings-layout' } );
});

module.exports = router;
