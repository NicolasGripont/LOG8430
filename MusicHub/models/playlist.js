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
			if(playlist && playlist.length > 0) {
				return cb({error:"The playlist already exist"});
			}
			dbP.save(function (err) {
				return cb(err);
			});
		});
	}
	
	remove(cb) {
		let query = {
			name:this.name,
			userEmail: this.user
		};
		DbPlaylist.find(query,function(error, playlist) {
			if(error) {
				return cb(error);
			}
			if(playlist && playlist.length <= 0) {
				return cb({error:"The playlist doesn't exist"});
			}
			DbPlaylist.remove(query,function (err) {
				return cb(err);
			});
		});
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

module.exports = Playlist;