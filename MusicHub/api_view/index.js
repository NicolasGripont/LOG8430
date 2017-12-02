var launch = function() {return require('./bin/www');};
var config = require("./config.json");
var host = config.host;
var port = config.port;

module.exports.host = host;
module.exports.port = port;
module.exports.launch = launch;