var express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    Twit = require('twit'),
    fs = require('fs'),
    config = require('./config.json'),
    request = require('request'),
    exec = require('child_process').exec,
    AWS = require('aws-sdk'),
    awsCreds = require('./aws.json');

AWS.config.update(awsCreds);
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

// Set up a heck of a callback chain through command line tools after a tweet is received
stream.on('tweet', function (tweet) {
  if (tweet.entities.user_mentions) {
    if (tweet.entities.user_mentions.filter(function(mention){return mention.screen_name == 'asciify'}).length > 0) {
      // Need to store these for our reply later
      var fromUser = tweet.user.screen_name,
          statusID = tweet.id_str;

      // Process it and reply with an image
      if (tweet.entities.media) {

        var imageURL = tweet.entities.media[0].media_url + ':large',
            imageString = tweet.entities.media[0].id_str + '.jpg',
            rawLocation = 'media-in/' + imageString,
            grayLocation = 'temp-gray/' + imageString
            asciiLocation = 'public/ascii-out/' + tweet.entities.media[0].id_str + '.txt',
            asciiImageLocation = 'ascii-img/' + imageString;

        request(imageURL).pipe(fs.createWriteStream(rawLocation)).on('close', function() {
          // After download finishes, we can run a chain of tools on it
          var convertCall = "convert " + rawLocation + " -sharpen 0x3.5 -colorspace gray -colors 4 -normalize " + grayLocation,
              jp2aCall = "jp2a -i --width=140 --output=" + asciiLocation + " " + grayLocation,
              rasterCall = "convert -size 800x1500 -background white -fill '#111111' -density 72 -pointsize 10 -kerning -0.5 -font Courier caption:@" + asciiLocation + " -resize '80x100%' -trim " + asciiImageLocation;
          //console.log(convertCall);
          //console.log(jp2aCall);
          //console.log(rasterCall);

          // exec() is async, need to call subsequent tools that need previous outputs in the callback
          var convertIt = exec(convertCall,function(err,stdout,stderr) {
            //console.log('convertIt done');
            var jp2aIt = exec(jp2aCall,function(err,stdout,stderr) {
              //console.log('jp2a done');
              var s3 = new AWS.S3({params: {Bucket: 'asciify-image-bucket', Key: tweet.entities.media[0].id_str + '.txt'}}),
                  uploadText = fs.readFileSync(asciiLocation);
                  // TODO don't use readFileSync
              var rasterIt = exec(rasterCall,function(err,stdout,stderr) {
                //console.log('raster done, time to reply');

                // Upload the file
                s3.upload({
                  Body:uploadText,
                  ContentType: 'text/plain'
                },function() {
                  //console.log("done uploading to S3");
                });

                // Need to b64 encode to upload to Twitter API
                var rawb64Content = fs.readFileSync(rawLocation, { encoding: 'base64' }),
                    asciiArtb64Content = fs.readFileSync(asciiImageLocation, { encoding: 'base64' });

                // Post the original image to Twitter
                T.post('media/upload', { media_data: rawb64Content }, function (err, data, response) {
                  var rawMediaIdStr = data.media_id_string;

                  // Post a raster image of the ascii art to Twitter
                  T.post('media/upload', { media_data: asciiArtb64Content }, function (err, data, response) {
                    var asciiMediaIdStr = data.media_id_string;

                    // Post the raw text to S3 and get the URL to include in the tweet
                    var tweetParams = { status: '.@' + fromUser + ' here you go! https://s3.amazonaws.com/asciify-image-bucket/' + tweet.entities.media[0].id_str + '.txt', in_reply_to_status_id: statusID, media_ids: [rawMediaIdStr,asciiMediaIdStr] }

                    // Finally reply!
                    T.post('statuses/update', tweetParams, function (err, data, response) {
                      //console.log('posted a reply after processing');
                    });
                  });
                });
              });
            });
          });
        });
      }
    }
  }
});

module.exports = app;
