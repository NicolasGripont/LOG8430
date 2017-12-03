var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var MongoDBStore = require('connect-mongodb-session')(session);
var cors = require('cors');
var common = require('musichub-common');
var _ = require('lodash');

var connexion = require('./routes/connection');
var app = express();

var config = common.config;


// DB connexion
var dbConfig = config.database;
var dbOptions = {useMongoClient: true};
var mongoURL = 'mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' +
	dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name;

mongoose.Promise = global.Promise;
mongoose.connect(mongoURL, dbOptions, function (error) {
    if(error) { //TODO
      console.log("Database error when mongoose.connect : ", error);
    }
});


var store = new MongoDBStore({
    uri: mongoURL,
    collection: 'sessions'
});
 
// Catch connexion errors on db
store.on('error', function(error) {
	//assert.ifError(error);
	//assert.ok(false);
	console.log("error");
});


var options = {
	origin: true,
	credentials:true,
	methods:['GET', 'PUT', 'POST','DELETE','OPTIONS'],
	allowedHeaders:['X-Requested-With', 'X-HTTP-Method-Override', 'Content-Type', 'Accept','access-control-allow-origin']
};
app.use(cors(options));
app.use(require('express-session')({
    secret: 'musicHubProject',
    domain:config.host,
    cookie: {
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
      domain:config.host
    },
    store: store,
    rolling: true,
    resave: true,
    saveUninitialized: false
  }));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

//TODO ajouter exception /user
var exceptionList = ["^\/views\/signup$","^\/views\/signin$","^\/public\/.*",
	"^\/user\/(signin|signup)$"
	];
app.use(function(req,res,next) {
	var path = _.find(exceptionList,function(elem) {
		var reg = new RegExp(elem, "g");
		return reg.test(req.path);
	});
	if(path) {
		return next();
	}
	req.session.reload(function(err) {
		if(err) {
			return res.status(401).json({message:'Not authorized'});
		}
		return next();
	});
});

app.use('/user', connexion);

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
  res.send('error');
});

module.exports = app;
