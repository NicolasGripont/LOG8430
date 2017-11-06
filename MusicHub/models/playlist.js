var DbPlaylist = require('../models_db/playlist');

class Playlist {
	constructor(name, user, musics) {
		this._name = name;
		this._musics = musics;
		this._user = user;
	}
	
	save(cb) {
		var dbP = new DbPlaylist({
			name : this.name,
			userEmail : this.user,
			musicList : this.musics
		});
		DbPlaylist.find({
			name:this.name,
			userEmail: this.user
		},function(error, playlist) {
			if(error) {
				return cb(error);
			}
			if(playlist) {
				return cb({error:"The playlist already exist"});
			}
			dbP.save(function (err) {
				return cb(err);
			});
		});
	}
	
	delete() {
		
	}
	
	get name() {
		return this._name;
	}
	
	get user() {
		return this._user;
	}
	
	get musics() {
		return this._musics;
	}
	
}

module.exports = User;