var _ = require('lodash');
var DbPlaylist = require('../models_db/modelSingleton').DbPlaylist;

/**
 * Represent a user Playlist
 */
class Playlist {
    /**
     * Constructor
     *
     * @param name        Name of the playlist.
     * @param userEmail   Email of the user who own the playlist.
     * @param musics      Musics of the playlist.
     */
	constructor(name, userEmail, musics) {
		this._name = name;
		this._musics = musics;
		this._userEmail = userEmail;
	}

    /**
     * Create the playlist in database
     *
     * @param cb   Function called when the playlist is created in database.
     *             Called with a json error or if failed, null if success as parameter.
     */
	save(cb) {
		var dbP = new DbPlaylist({
			name : this.name,
			userEmail : this.userEmail,
			musics : this.musics
		});
		DbPlaylist.find({
			name:this.name,
			userEmail: this.userEmail
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

    /**
     * Delete the playlist from database
     *
     * @param cb   Function called when the playlist is deleted from database.
     *             Called with a json error or if failed, null if success as parameter.
     */
	remove(cb) {
		let query = {
			name:this.name,
			userEmail: this.userEmail
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

    /**
     * Find all user playlists in database (corresponding to the attribute this.userEmail)
     *
     * @param cb   Function called when the playlists are retrieved from database.
     *             Called with a json error and null or if failed, null ans the playlists if success as parameter.
     */
	findAllPlaylists(cb) {
		var query = {userEmail : this.userEmail};
		DbPlaylist.find(query, function(error, playlists) {
			if(error) {
				return cb(error);
			}
			return cb(null, playlists);
        });
	}

    /**
     * Find user playlist in database corresponding to the attribute this.name and this.userEmail
     *
     * @param cb   Function called when the playlist is retrieved from database.
     *             Called with a json error and null or if failed, null ans the playlists if success as parameter.
     */
	findPlaylist(cb) {
		var query = {
			userEmail : this.userEmail,
			name: this.name
		};
		DbPlaylist.find(query, function(error, playlists) {
			if(error) {
				return cb(error);
			}
			return cb(null, playlists);
        });
	}

    /**
     * Add music to current playlist.
     *
     * @param music  Music to add.
     * @param cb     Function called when the music is added to the playlist.
     *               Called with a json error and null or if failed, null ans the music if success as parameter.
     */
	addMusic(music, cb) {
		var query = {
			name : this.name,
			userEmail : this.userEmail
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

    /**
     * Delete the first instance of the music from the current playlist.
     *
     * @param music  Music to add.
     * @param cb     Function called when the music is deleted from the playlist.
     *               Called with a json error and null or if failed, null ans the music if success as parameter.
     */
	deleteMusic(music, cb) {
		var query = {
			name : this.name,
			userEmail : this.userEmail
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

    /**
     * Getter of the playlist name.
     *
     * @returns {*} The email
     */
	get name() {
		return this._name;
	}

    /**
     * Getter of the email of the playlist owning user.
     *
     * @returns {*} The owning user
     */
	get userEmail() {
		return this._userEmail;
	}

    /**
     * Getter of the playlist musics/tracks list.
     *
     * @returns {*} The musics/tracks lists
     */
	get musics() {
		return this._musics;
	}
	
}

/**
 * Export the Playlist class
 * @type {Playlist} Model class of an user music Playlist
 */
module.exports = Playlist;