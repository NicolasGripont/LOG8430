var Singleton = require('./modelsRequireMusicSettings');
var Music = Singleton.Music;
var Settings = Singleton.Settings;
var Playlist = require('./playlist');
var User = require('./user');
var DeezerConnectorParams = require('./deezer-connector-params');
var SpotifyConnectorParams = require('./spotify-connector-params');
var DeezerConnector = require('./deezer-connector');
var SpotifyConnector = require('./spotify-connector');

module.exports.Music = Music;
module.exports.Playlist = Playlist;
module.exports.Settings = Settings;
module.exports.DeezerConnectorParams = DeezerConnectorParams;
module.exports.SpotifyConnectorParams = SpotifyConnectorParams;
module.exports.DeezerConnector = DeezerConnector;
module.exports.SpotifyConnector = SpotifyConnector;
module.exports.User = User;
