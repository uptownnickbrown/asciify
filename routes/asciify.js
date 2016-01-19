var express = require('express');
var router = express.Router();

/* Got a request to asciify something */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
