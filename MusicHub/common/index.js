var config = require("./config.json");
var deezer = require("./models/deezer-connector");
var spotify = require("./models/spotify-connector");
var deezer = require("./models/spotify-connector");

var host = config.host;
var port = config.port;

module.exports.config = config;
module.exports.host = host;
module.exports.port = port;