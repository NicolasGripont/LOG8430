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
				return cb({message:"The playlist already exist"});
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
				return cb({message:"The playlist doesn't exist"});
			}
			DbPlaylist.remove(query,function (err) {
				return cb(err);
			});
		});
	}

	findAllPlaylists(cb) {
		var query = {userEmail : this.user};
		DbPlaylist.find(query, function(error, playlists) {
			if(error) {
				return cb(error);
			}
			return cb(null, playlists);
        });
	}
	
	findPlaylist(cb) {
		var query = {
			userEmail : this.user,
			name: this.name
		};
		DbPlaylist.find(query, function(error, playlists) {
			if(error) {
				return cb(error);
			}
			return cb(null, playlists);
        });
	}

	findPlaylist(cb) {
		var query = {name : this.name};
        DbPlaylist.find(query, function(error, playlist) {
            if(error || playlist.length !== 1) {
                return cb(error, null);
            }
            return cb(null, playlist[0]);
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