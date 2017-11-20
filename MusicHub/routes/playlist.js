var express = require('express');
var router = express.Router();
var PlaylistController = require('../controllers/playlist-controller');
var controller = new PlaylistController();

router.post('/create', function(req, res) {
	controller.createPlaylist(req,res);
});

router.delete('/delete', function(req, res) {
	controller.deletePlaylist(req,res);
});

module.exports = router;
