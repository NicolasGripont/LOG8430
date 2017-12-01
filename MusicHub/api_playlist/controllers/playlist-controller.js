var Common = require('musichub-common');
var Playlist = Common.Playlist;
var Music = Common.Music;

/**
 * Define Playlist Controller for MVC
 */
class PlaylistController {

    /**
     * Constructor
     */
    constructor() {}

    /**
     * Create the playlist with eq.body.playlistName as name for the user corresponding the session.email.
     * If success, send an OK json message with the status code 200.
     * If fail, send an error json message with the status code 400.
     *
     * @param req  Http request
     * @param res  Http response
     */
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

    /**
     * Delete the playlist corresponding to req.body.playlistName for the user corresponding the session.email.
     * If success, send an OK json message with the status code 200.
     * If fail, send an error json message with the status code 400.
     *
     * @param req  Http request
     * @param res  Http response
     */
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
    /**
     * Find all playlists corresponding of the user corresponding the session.email.
     * If success, send an OK json message with the status code 200.
     * If fail, send an error json message with the status code 500.
     *
     * @param req  Http request
     * @param res  Http response
     */
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

    /**
     * Find the playlist corresponding to req.body.playlistName for the user corresponding the session.email.
     * If success, send an OK json message with the status code 200.
     * If fail, send an error json message with the status code 500.
     * If no playlist corresponding, send an error json message with the status code 400.
     *
     * @param req  Http request
     * @param res  Http response
     */
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
				return res.status(400).json({message:"The playlist doesn't exist"});
			}
			return res.status(200).json(playlists[0]);
		});
    }

    /**
     * Add a music corresponding to req.body.musicId, req.body.musicPlatform to the playlist corresponding.
     * to req.body.playlistName for the user corresponding the session.email.
     * If success, send an OK json message with the status code 200.
     * If fail, send an error json message with the status code 500.
     *
     * @param req  Http request
     * @param res  Http response
     */
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

    /**
     * Delete a music (first apparition) corresponding to req.body.musicId, req.body.musicPlatform from the playlist.
     * corresponding to req.body.playlistName for the user corresponding the session.email.
     * If success, send an OK json message with the status code 200.
     * If fail, send an error json message with the status code 500.
     * If no playlist corresponding, send an error json message with the status code 400.
     *
     * @param req  Http request
     * @param res  Http response
     */
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
 * Export the PlaylistController class
 * @type {PlaylistController} Controller class of PlaylistController
 */
module.exports = PlaylistController;