var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    Twit = require('twit'),
    fs = require('fs'),
    config = require('./config.json'),
    request = require('request'),
    exec = require('child_process').exec;

var twitter_creds = config.twitter_creds;

var app = express();

app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

var asciify = require('./routes/asciify');
app.use('/asciify', asciify);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.status('error').send({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.status('error').send({
    message: err.message,
    error: {}
  });
});

// Initialize Twitter watcher
var T = new Twit({
    consumer_key: twitter_creds.consumer_key,
    consumer_secret: twitter_creds.consumer_secret,
    access_token: twitter_creds.access_token,
    access_token_secret: twitter_creds.access_token_secret
});

var stream = T.stream('user');

stream.on('tweet', function (tweet) {
  console.log('tweet received');
  if (tweet.in_reply_to_screen_name == 'asciify') {

    console.log('it\'s for me!');
    var fromUser = tweet.user.screen_name;

    // Process it and reply with an image
    if (tweet.entities.media) {
      console.log('it\'s got an image!');
      var imageURL = tweet.entities.media[0].media_url + ':large',
          imageString = tweet.entities.media[0].id_str + '.jpg',
          rawLocation = 'media-in/' + imageString,
          grayLocation = 'temp-gray/' + imageString
          asciiLocation = 'public/ascii-out/' + tweet.entities.media[0].id_str + '.txt',
          asciiImageLocation = 'ascii-img/' + imageString;

      request(imageURL).pipe(fs.createWriteStream(rawLocation)).on('close', function() {
        console.log("File finished downloading")
        var convertCall = "convert " + rawLocation + " -sharpen 0x3.5 -colorspace gray -colors 4 -normalize " + grayLocation,
            jp2aCall = "jp2a -i --width=140 --output=" + asciiLocation + " " + grayLocation,
            rasterCall = "convert -size 800x2000 -background white -fill '#333333' -density 72 -pointsize 9 -font Courier caption:@" + asciiLocation + " -trim " + asciiImageLocation;
        console.log(convertCall);
        console.log(jp2aCall);
        console.log(rasterCall);
        var convertIt = exec(convertCall,function(err,stdout,stderr) {
          console.log('convertIt done');
          var jp2aIt = exec(jp2aCall,function(err,stdout,stderr) {
            console.log('jp2a done');
            var rasterIt = exec(rasterCall,function(err,stdout,stderr) {
              console.log('raster done, time to reply');
              var params = {
                status: '@' + fromUser + ' right back at ya',
                in_reply_to_status_id: tweet.id_str
              };
              T.post('statuses/update', params, function(err, data, response) {
                console.log('posted a reply after processing');
              });
            });
          });
        });
      });
    } else {
      // Just send a dumb reply
      var params = {
        status: '@' + fromUser + ' right back at ya',
        in_reply_to_status_id: tweet.id_str
      };
      T.post('statuses/update', params, function(err, data, response) {
        console.log('posted a reply');
      });
    }
  }
});


module.exports = app;
