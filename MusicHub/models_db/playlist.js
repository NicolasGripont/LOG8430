var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artist = {
	artistID: {type: Number, required: true, unique: true},
	artistName: {type: String, required: true}
};

var album = {
	albumID: {type: Number, required: true, unique: true},
	albumName: {type: String, required: true},
	artists: [artist]
};

var music = {
	musicID: {type: Number, required: true, unique: true},
	musicName: {type: String, required: true},
	duration: {type: Number, required: true},
	url: {type: String, required: true},
	album: album,
	artists:[artist]
};

var playlistSchema = new Schema({
	playlistID: {type: Number, required: true, unique: true},
    name: {type: String, required: true},
    userEmail: {type: Number, required: true},
    musicList: [music]
});

module.exports = mongoose.model("Playlist", playlistSchema);