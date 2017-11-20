var Playlist = require('../models/playlist');

class PlaylistController {
	constructor() {}
	
	createPlaylist(req,res) {
		var name = req.body.name || "";
		if(name === "") {
			return res.json({error:"The parameter name is invalid"});
		}
		console.log("session:"+ req.session.email);
		var list = new Playlist(name,req.session.email,[]);
		list.save(function(err) {
			if(err) {
				return res.json(err);
			}
			return res.json({ok:"ok"});
		});
	}
	
	deletePlaylist(req,res) {
		
	}
}

module.exports = PlaylistController;