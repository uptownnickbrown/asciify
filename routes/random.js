var express = require('express'),
    logger = require('morgan'),
    runOnce = require('./runOnce.js');

var router = express.Router();

router.get('/', function(req, res, next) {
  runOnce(res);
});

module.exports = router;
