var express = require('express');
var validator = require('validator');
var ConnectorController = require('../controllers/connector-controller');

var router = express.Router();

/**
 * Manage the User connecion on APIs
 *
 * req.session.email : should be defined
 */
router.get('/connection/:api/:action', function(req, res, next) {
    var connectorController = new ConnectorController();
    connectorController.executeAction(req,res,req.params.api,req.params.action);
});

/**
 * Get the User Settings
 *
 * req.session.email : should be defined
 */
router.get('/settings', function(req, res, next) {
    var connectorController = new ConnectorController();
    connectorController.sendSettings(req,res);
});

/**
 * Search tracks corresponding to query param
 *
 * req.session.email : should be defined
 */
router.get('/search/:query', function(req, res, next) {
    var connectorController = new ConnectorController();
    connectorController.search(req,res,req.params.query);
});


module.exports = router;