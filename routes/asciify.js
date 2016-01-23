var express = require('express');
var fs = require('fs');
var router = express.Router();

/* Home page, pull in all past examples */
router.get('/', function(req, res, next) {
  var testImages = fs.readdirSync('public/media-in').reverse();
  testImages = testImages.filter(function(filename) {return filename.indexOf(".jpg") > -1;});
  var output = '<html><title>Asciify</title></html><body><h2>Asciify - Most recently processed images</h2><h4><a href="https://twitter.com/asciify">See me in action on Twitter - https://twitter.com/asciify</a></h4><div>' +
    testImages.map(function(image){return '<div style="margin-top:25px;float:left;width:45%;margin-left:2.5%"><img style="width:100%" src="./media-in/' + image + '"/></div><div style="margin-top:25px;float:left;width:45%;margin-right:2.5%" ><img style="width:100%" src="./ascii-img/' + image + '"/></div>';}); +
    '</div></body>';
  res.send(output);
});

module.exports = router;
