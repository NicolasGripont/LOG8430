var Playlist = require('../models/playlist');
var ControllerConnector = require('./connector-controller');

class PlaylistController {
	constructor() {}
	
	createPlaylist(req,res) {
		var name = req.body.name || "";
		if(name === "") {
			return res.json({error:{message:"The parameter name is invalid"}});
		}
		var list = new Playlist(name,req.session.email,[]);
		list.save(function(err) {
			if(err) {
				return res.json({error:err});
			}
			return res.json({ok:"ok"});
		});
	}
	
	deletePlaylist(req,res) {
		var name = req.body.name || "";
		if(name === "") {
			return res.json({error:{message:"The parameter name is invalid"}});
		}
		var list = new Playlist(name,req.session.email,[]);
		list.remove(function(err) {
			if(err) {
				return res.json({error:err});
			}
			return res.json({ok:"ok"});
		});
	}
	//TODO : Creer un objet error
    findPlaylists(req, res) {
		var email = req.session.email;
		var playlist = new Playlist("", email, []);
		playlist.findAllPlaylists(function(error, playlists) {
			if(error) {
				return res.json({error : error});
			}
			return res.json(playlists);
		});
	}
    
    findOnePlaylist(req, res) {
    	var email = req.session.email;
    	var name = req.params.name || "";
    	if(name === "") {
    		return res.json({error:{message:"The name is not valid"}});
    	}
		var playlist = new Playlist(name, email, []);
		playlist.findPlaylist(function(error, playlists) {
			if(error) {
				return res.json({error : error});
			}
			if(!playlists || playlists.length <= 0) {
				return res.json({error:{message:"The playlist doesn't exist"}});
			}
			return res.json(playlists[0]);
		});
    }
    
    addMusic(req,res) {
    	var id = req.body.id || "";
    	var platform = req.body.platform || "";
    	var namePlaylist = req.body.name || "";
    	if(id === "" || platform === "" || namePlaylist === "") {
    		return res.json({error:{message:"The parameters are not valid"}});
    	}
		var playlist = new Playlist(namePlaylist, req.session.email, []);
		var connector = new ControllerConnector();
		connector.findTrack(id,platform,req.session.email, function(err,music) {
			if(err) {
				return res.json({error:err});
			}
			playlist.addMusic(music);
			playlist.update(function(err) {
				if(err) {
					return res.json({error:err});
				}
				return res.json(music);
			});
			
		});
    }
}

module.exports = PlaylistController;