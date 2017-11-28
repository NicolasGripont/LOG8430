var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artist = {
	name: {type: String, required: true}
};

var album = {
	name: {type: String, required: true},
	artists: [artist]
};

var music = {
	title: {type: String, required: true},
	platform: {type: String, required: true},
	duration: {type: Number, required: true},
	previewUrl:{type: String, required: true},
	album: album,
	artists:[artist]
};

var playlistSchema = new Schema({
    name: {type: String, required: true},
    userEmail: {type: String, required: true},
    musics: [music]
});

playlistSchema.index({ name: 1, userEmail: 1}, { unique: true });

module.exports = mongoose.model("Playlist", playlistSchema);