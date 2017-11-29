var _ = require('lodash');
var DbPlaylist = require('../models_db/modelSingleton').DbPlaylist;

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
			musics : this.musics
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
	
	addMusic(music, cb) {
		var query = {
			name : this.name,
			userEmail : this.user
		};
		DbPlaylist.find(query,function(err,playlist) {
			if(err) {
				return cb(err);
			}
			if(playlist.length !==1) {
				return cb ({message:"The playlist doesn't exist"});
			}
			playlist[0].musics.push(music);
			playlist[0].save(function(err) {
				return cb(err,music);
			});
		});
	}
	
	deleteMusic(music, cb) {
		var query = {
			name : this.name,
			userEmail : this.user
		};
		DbPlaylist.find(query,function(err,playlist) {
			if(err) {
				return cb(err);
			}
			if(playlist.length !==1) {
				return cb ({message:"The playlist doesn't exist"});
			}
			var index = _.findIndex(playlist[0].musics, function(m) { return m.id === music.id && m.platform === music.platform; });
			if(index === -1) {
				return cb({message:"The music is not in the playlist"});
			}
			playlist[0].musics.splice(index, 1);
			playlist[0].save(function(err) {
				return cb(err,music);
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