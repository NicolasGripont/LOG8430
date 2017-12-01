var express = require('express');
var router = express.Router();
var PlaylistController = require('../controllers/controllerSingleton').PlaylistController;
var controller = new PlaylistController();


/**
 * Create a Playlist for the User connected.
 *
 * req.body.playlistName : should be defined
 * req.session.email : should be defined
 */
router.post('/create', function(req, res) {
	controller.createPlaylist(req,res);
});

/**
 * Delete a Playlist of the User connected
 *
 * req.body.playlistName : should be defined
 * req.session.email : should be defined
 */
router.delete('/delete', function(req, res) {
	controller.deletePlaylist(req,res);
});

/**
 * Get all Playlists of the User connected
 *
 * req.session.email : should be defined
 */
router.get('/', function(req, res) {
	controller.findPlaylists(req, res);
});

/**
 * Get all Playlist of the User connected corresponding to the playlistName
 *
 * req.body.playlistName : should be defined
 * req.session.email : should be defined
 */
router.get('/:playlistName', function(req, res) {
	controller.findOnePlaylist(req, res);
});

/**
 * Add a music to the playlist
 *
 * req.body.playlistName : should be defined
 * req.session.email : should be defined
 * req.body.musicId : should be defined
 * req.body.musicPlatform : should be defined
 */
router.put('/music', function(req, res) {
	controller.addMusic(req,res);
});

/**
 * Delete a music from the playlist (first occurrence)
 *
 * req.body.playlistName : should be defined
 * req.session.email : should be defined
 * req.body.musicId : should be defined
 * req.body.musicPlatform : should be defined
 */
router.delete('/music', function(req, res) {
	controller.deleteMusic(req,res);
});

module.exports = router;
