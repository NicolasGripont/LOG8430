var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var spotify = {
    accessToken: {type: String, required: true},
    refreshToken: {type: String, required: true},
    expires: {type: Number, required: true}
};

var deezer = {
    accessToken: {type: String, required: true},
    expires: {type: Number, required: true}
};

var setting = new Schema({
    userEmail: {type: String, required: true, unique: true},
    spotify: {type: spotify, required: false},
    deezer: {type: deezer, required: false}
});

module.exports = mongoose.model("Setting", setting);