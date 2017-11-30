var Playlist = require('../models/playlist');
var ControllerConnector = require('./controllerSingleton').ConnectorController;
var Music = require('../models/modelsSingleton').Music;

class PlaylistController {
	constructor() {}
	
	createPlaylist(req,res) {
		var playlistName = req.body.playlistName || "";
		if(playlistName === "") {
			return res.status(400).json({message:"The parameter playlistName is invalid."});
		}
		var list = new Playlist(playlistName,req.session.email,[]);
		list.save(function(err) {
			if(err) {
                return res.status(400).json({message:"Playlist name already used."});
			}
			return res.status(200).json({message:"OK"});
		});
	}
	
	deletePlaylist(req,res) {
		var playlistName = req.body.playlistName || "";
		if(playlistName === "") {
            return res.status(400).json({message:"The parameter playlistName is invalid."});
		}
		var list = new Playlist(playlistName,req.session.email,[]);
		list.remove(function(err) {
			if(err) {
                return res.status(500).json({message:"Error during the suppression."});
			}
			return res.status(200).json({message:"OK"});
		});
	}
	//TODO : Creer un objet error
    findPlaylists(req, res) {
		var email = req.session.email;
		var playlist = new Playlist("", email, []);
		playlist.findAllPlaylists(function(error, playlists) {
			if(error) {
                return res.status(500).json({message:"Error during the playlists recovery."});
			}
			return res.status(200).json(playlists);
		});
	}
    
    findOnePlaylist(req, res) {
    	var email = req.session.email;
    	var playlistName = req.params.playlistName || "";
    	if(playlistName === "") {
            return res.status(400).json({message:"The playlist name is not valid."});
    	}
		var playlist = new Playlist(playlistName, email, []);
		playlist.findPlaylist(function(error, playlists) {
			if(error) {
                return res.status(500).json({message:"Error during the playlist recovery."});
			}
			if(!playlists || playlists.length <= 0) {
				return res.json({message:"The playlist doesn't exist"});
			}
			return res.status(200).json(playlists[0]);
		});
    }
    
    addMusic(req,res) {
    	var musicId = req.body.musicId || "";
    	var musicPlatform = req.body.musicPlatform || "";
    	var playlistName = req.body.playlistName || "";
    	if(musicId === "" || musicPlatform === "" || playlistName === "") {
    		return res.status(400).json({message:"The parameters are not valid."});
    	}
		var playlist = new Playlist(playlistName, req.session.email, []);
		var connector = new ControllerConnector();
		connector.findTrack(musicId,musicPlatform,req.session.email, function(err,music) {
			if(err) {
                return res.status(500).json({message:"Error during song recovery."});
			}
			playlist.addMusic(music, function(err) {
				if(err) {
                    return res.status(500).json({message:"Error during the update."});
				}
				return res.status(200).json(music);
			});
		});
    }
    
    deleteMusic(req,res) {
        var musicId = req.body.musicId || "";
        var musicPlatform = req.body.musicPlatform || "";
        var playlistName = req.body.playlistName || "";
    	if(musicId === "" || musicPlatform === "" || playlistName === "") {
    		return res.status(400).json({message:"The parameter playlistName is invalid."});
    	}
    	var music = new Music(musicId, musicPlatform, "", [], {}, 0, "");
		var playlist = new Playlist(playlistName, req.session.email, []);
		playlist.deleteMusic(music, function(err) {
			if(err) {
                return res.status(500).json({message:"Error during the update."});
			}
			return res.status(200).json({message:"OK"});
		});
    }
}

/**
 * Export the Playlist class
 * @type {PlaylistController} Model class of an user music Playlist
 */
module.exports = PlaylistController;