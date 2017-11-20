var express = require('express');
var router = express.Router();
var PlaylistController = require('../controllers/playlist-controller');
var controller = new PlaylistController();

router.put('/create', function(req, res) {
	controller.createPlaylist(req,res);
});

router.delete('/delete', function(req, res) {
	controller.delete(req,res);
});

module.exports = router;
