var express = require('express');
var path = require('path');
var logger = require('morgan');
var Twit = require('twit'),
    fs = require('fs'),
    config = require('./config.json');

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
    var params = {
                    status: '@' + fromUser + ' right back at ya',
                    in_reply_to_status_id: tweet.id_str
                 };
    T.post('statuses/update', params, function(err, data, response) {
      console.log('tried to post a reply')
      replySave = data;
    });
  }
  tweetSave = tweet;
});


module.exports = app;
