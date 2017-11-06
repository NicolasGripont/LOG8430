var express = require('express');
var validator = require('validator');
var ConnectorController = require('../controllers/connector-controller');

var router = express.Router();

router.get('/connection/:api/:action', function(req, res, next) {
    var connectorController = new ConnectorController();
    connectorController.connection(req,res,req.params.api,req.params.action);
});

module.exports = router;