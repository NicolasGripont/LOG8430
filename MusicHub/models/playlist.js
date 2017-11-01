
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artist = {
	artistName: {type: String, required: true}
};

var album = {
	albumName: {type: String, required: true},
	artists: [artist]
};

var music = {
	musicName: {type: String, required: true},
	duration: {type: Number, required: true},
	url: {type: String, required: true},
	album: album,
	artists:[artist]
};

var playlistSchema = new Schema({
    name: {type: String, required: true},
    userID: {type: Number, required: true},
    musicList: [music]
});

module.exports = mongoose.model("Playlist", playlistSchema);