var express = require('express');
var validator = require('validator');
var ConnectorController = require('../controllers/connector-controller');

var router = express.Router();

router.get('/connection/:api/:action', function(req, res, next) {
    var connectorController = new ConnectorController();
    connectorController.executeAction(req,res,req.params.api,req.params.action);
});


router.get('/settings', function(req, res, next) {
    var connectorController = new ConnectorController();
    connectorController.sendSettings(req,res);
});




module.exports = router;