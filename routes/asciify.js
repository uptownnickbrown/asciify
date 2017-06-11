var express = require('express');
var fs = require('fs');
var router = express.Router();

/* Home page, pull in all past examples */
router.get('/', function(req, res, next) {
  var testImages = fs.readdirSync('public/media-in').reverse();
  testImages = testImages.filter(function(filename) {return filename.indexOf(".jpg") > -1;});
  var output = '';
  var head = '<!DOCTYPE html><head><meta http-equiv="Content-Type" content="text/html;charset=utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="description" content="Nick Brown | Asciify"><meta name="author" content="Nick Brown"><meta name="robots" content="index, follow"><link rel="icon" type="image/png" sizes="32x32" href="assets/favicon-32x32.png"><link rel="icon" type="image/png" sizes="16x16" href="assets/favicon-16x16.png"><title>Asciify</title><link href="https://fonts.googleapis.com/css?family=Lato:300|Roboto+Slab:300,500,600,700|Oswald:400,700" rel="stylesheet" type="text/css"><link href="stylesheets/bootstrap.min.css" rel="stylesheet"><link href="stylesheets/style.css" rel="stylesheet"></head>';
  output += head;
  var body = '<body><div class="container"><h2>Asciify</h2><p>See me in action on Twitter <a href="https://twitter.com/asciify">@asciify</a> - simply send a tweet to @asciify with an image attached to receive your ascii art in the reply.</p><p>Don\'t have an image handy and want to try it out? Click here to retrieve a random image and <a id="tryMe" href="/random">asciify it now!</a></p><p id="showWaiting" style="display:none;">Thanks! It can take a few moments to process. . .redirecting shortly. . .</p><p>Built by <a href="https://twitter.com/uptownnickbrown">@uptownnickbrown</a>, check out my other projects at <a href="https://uptownnickbrown.com">uptownnickbrown.com</a></p></div><div class="container"><h3>Check out a few recent asciified images:</h3>';
  output += body;

  var i = 0;
  var shown = 0;
  while (i < testImages.length && shown < 10) {
    if (Math.random() < .15) {
      output = output + '<div class="row"><div style="margin-top:5px;float:left;width:48%;margin-left:1%;margin-right:1%;max-height:450px;overflow:hidden;"><img style="width:100%" src="./media-in/' + testImages[i] + '"/></div><div style="margin-top:5px;float:left;width:48%;margin-right:1%;margin-left:1%;max-height:450px;overflow:hidden;" ><img style="width:100%" src="./ascii-img/' + testImages[i] + '"/></div></div>'
      shown += 1;
    }
    i++;
  }

  output = output + "</div><script>document.getElementById('tryMe').onclick = function(){document.getElementById('showWaiting').style.display = 'block';};</script><script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-61422873-2', 'auto');ga('send', 'pageview');</script></body></html>";
  res.send(output);
});

module.exports = router;
