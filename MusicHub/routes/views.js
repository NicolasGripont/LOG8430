var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Music Hub' });
});

router.get('/user/signup', function(req, res, next) {
    // res.render('view', { title: 'Sign In', layout: 'simple-layout' });
    res.render('user/signup', {  title: 'Sign Up', layout: 'simple-layout' } );
});

router.get('/user/signin', function(req, res, next) {
    // res.render('view', { title: 'Sign In', layout: 'simple-layout' });
    res.render('user/signin', {  title: 'Sign In', layout: 'simple-layout' } );
});

module.exports = router;
