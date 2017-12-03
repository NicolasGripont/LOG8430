var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var user = new Schema({
    email: {type: String, unique:true, required: true},
    password: {type: String, required: true},
    token: {type: String, required: false},
    expires: {type: String, required: false}
});

module.exports = mongoose.model("User2", user);