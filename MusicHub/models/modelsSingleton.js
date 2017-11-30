var Music = require('./modelsRequireMusicSettings').Music;
var Playlist = require('./playlist');
var Settings = require('./modelsRequireMusicSettings').Settings;
var User = require('./user');
var DeezerConnector = require('./deezer-connector');
var SpotifyConnector = require('./spotify-connector');

module.exports.Music = Music;
module.exports.Playlist = Playlist;
module.exports.Settings = Settings;
module.exports.DeezerConnector = DeezerConnector;
module.exports.SpotifyConnector = SpotifyConnector;
module.exports.User = User;
