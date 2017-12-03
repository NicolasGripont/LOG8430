var config = require("./config.json");
var DeezerConnectorParams = require("./models/deezer-connector-params");
var SpotifyConnectorParams = require("./models/spotify-connector-params");
var DeezerConnector = require("./models/deezer-connector");
var SpotifyConnector = require("./models/spotify-connector");
var Music = require("./models/music");
var Playlist = require("./models/playlist");
var Settings = require("./models/settings");
var User = require("./models/user");
var PlaylistDB = require("./models_db/playlist");
var SettingsDB = require("./models_db/settings");
var UserDB = require("./models_db/user");

module.exports.config = config;
module.exports.DeezerConnectorParams = DeezerConnectorParams;
module.exports.SpotifyConnectorParams = SpotifyConnectorParams;
module.exports.DeezerConnector = DeezerConnector;
module.exports.SpotifyConnector = SpotifyConnector;
module.exports.Music = Music;
module.exports.Playlist = Playlist;
module.exports.Settings = Settings;
module.exports.User = User;
module.exports.PlaylistDB = PlaylistDB;
module.exports.SettingsDB = SettingsDB;
module.exports.UserDB = UserDB;