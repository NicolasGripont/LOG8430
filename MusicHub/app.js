var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressHandlebars = require('express-handlebars');
var mongoose = require('mongoose');

var index = require('./routes/index');

var app = express();

var config = require('./config.json');


// DB connexion
var dbConfig = config.database;
var dbOptions = {useMongoClient: true};
mongoose.connect('mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' +
    dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name, dbOptions, function (error) {

    if(error) { //TODO
      console.log("Database error when mongoose.connect : ", error);
    }
});

// Test DB
//
// var User = require('./models/user');
//
// User.create({
//     email : "ludo@gmail.com",
//     password : "pass"
// }, function(error, user) {
//     if (error)
//         console.log("Database error when User.create : ", error);
//     User.find(function(error, user) {
//         if (error)
//             console.log("Database error when User.find : ", error);
//         console.log("Database success when User.find : " + user);
//     });
// });
//
// Fin Test DB

// view engine setup
app.engine('.hbs', expressHandlebars({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
