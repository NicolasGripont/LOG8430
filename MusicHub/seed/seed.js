var User = require('../models_db/user');
var config = require('../common/config.json');
var mongoose = require('mongoose');

// DB connexion
var dbConfig = config.database;
var dbOptions = {useMongoClient: true};
mongoose.connect('mongodb://' + dbConfig.username + ':' + dbConfig.password + '@' +
    dbConfig.host + ':' + dbConfig.port + '/' + dbConfig.name, dbOptions, function (error) {
    if(error) { //TODO
        console.log("Database error when mongoose.connect : ", error);
    }
});

var users = [
    new User({
        "email": "admin@admin.com",
        "password": "admin"
    })
];

var done = 0;
for(var i = 0; i < users.length; i++) {
    users[i].save(function (err, res) {
        done++;
        if(err){
            console.log(err);
        } else {
            console.log("success");
        }
        if(done === users.length){
            exit();
        }
    });
}

function exit() {
    mongoose.disconnect();
}

