var express = require('express');
var router = express.Router();
var PlaylistController = require('../controllers/controllerSingleton').PlaylistController;
var controller = new PlaylistController();

router.post('/create', function(req, res) {
	controller.createPlaylist(req,res);
});

router.delete('/delete', function(req, res) {
	controller.deletePlaylist(req,res);
});

router.get('/', function(req, res) {
	controller.findPlaylists(req, res);
});

router.get('/:playlistName', function(req, res) {
	controller.findOnePlaylist(req, res);
});

router.put('/music', function(req, res) {
	controller.addMusic(req,res);
});

router.delete('/music', function(req, res) {
	controller.deleteMusic(req,res);
});

module.exports = router;
