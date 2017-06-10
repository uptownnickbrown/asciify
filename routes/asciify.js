var express = require('express');
var fs = require('fs');
var router = express.Router();

/* Home page, pull in all past examples */
router.get('/', function(req, res, next) {
  var testImages = fs.readdirSync('public/media-in').reverse();
  testImages = testImages.filter(function(filename) {return filename.indexOf(".jpg") > -1;});
  var output = '<!DOCTYPE html><head>    <meta charset="utf-8">    <meta http-equiv="X-UA-Compatible" content="IE=edge">    <meta name="viewport" content="width=device-width, initial-scale=1">    <meta name="description" content="">    <meta name="author" content="">    <meta name="robots" content="noindex, follow">    <title>Asciify</title>    <link href="https://fonts.googleapis.com/css?family=Lato:300|Roboto+Slab:300,500,600,700|Oswald:400,700" rel="stylesheet" type="text/css">    <link href="stylesheets/bootstrap.min.css" rel="stylesheet">    <link href="stylesheets/style.css" rel="stylesheet"></head><body><div class="container" /><h2>Asciify - Most recently processed images</h2><p>See me in action on Twitter - <a href="https://twitter.com/asciify">https://twitter.com/asciify</a></p><p>Or retrieve a random image and <a href="/random">asciify it now!</a></p><div class="container">';

  var i = 0;
  while (i < testImages.length) {
    output = output + '<div class="row"><div style="margin-top:5px;float:left;width:48%;margin-left:1%;margin-right:1%"><img style="width:100%" src="./media-in/' + testImages[i] + '"/></div><div style="margin-top:5px;float:left;width:48%;margin-right:1%;margin-left:1%" ><img style="width:100%" src="./ascii-img/' + testImages[i] + '"/></div></div>'
    i++;
  }

  output = output + "</div><script>(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create', 'UA-61422873-2', 'auto');ga('send', 'pageview');</script></body></html>";
  res.send(output);
});

module.exports = router;
