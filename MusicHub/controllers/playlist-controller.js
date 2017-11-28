var Playlist = require('../models/playlist');
var ControllerConnector = require('./connector-controller');

class PlaylistController {
	constructor() {}
	
	createPlaylist(req,res) {
		var name = req.body.name || "";
		if(name === "") {
			return res.status(400).json({message:"The parameter name is invalid."});
		}
		var list = new Playlist(name,req.session.email,[]);
		list.save(function(err) {
			if(err) {
                return res.status(400).json({message:"Playlist name already used."});
			}
			return res.status(200).json({message:"OK"});
		});
	}
	
	deletePlaylist(req,res) {
		var name = req.body.name || "";
		if(name === "") {
            return res.status(400).json({message:"The parameter name is invalid."});
		}
		var list = new Playlist(name,req.session.email,[]);
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
    	var name = req.params.name || "";
    	if(name === "") {
            return res.status(400).json({message:"The name is not valid."});
    	}
		var playlist = new Playlist(name, email, []);
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
    	var id = req.body.id || "";
    	var platform = req.body.platform || "";
    	var namePlaylist = req.body.name || "";
    	if(id === "" || platform === "" || namePlaylist === "") {
    		return res.json({error:{message:"The parameters are not valid."}});
    	}
		var playlist = new Playlist(namePlaylist, req.session.email, []);
		var connector = new ControllerConnector();
		connector.findTrack(id,platform,req.session.email, function(err,music) {
			if(err) {
                return res.status(500).json({message:"Error during song recovery."});
			}
			playlist.addMusic(music);
			playlist.update(function(err) {
				if(err) {
                    return res.status(400).json({message:"Error during the update."});
				}
				return res.status(200).json(music);
			});
		});
    }
}

module.exports = PlaylistController;