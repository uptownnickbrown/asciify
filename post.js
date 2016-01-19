var Twit = require('twit'),
    nconf = require('nconf');

nconf.file('config.json')
var twitter_creds = nconf.get('twitter_creds');

var T = new Twit(
  {
    consumer_key: twitter_creds.consumer_key,
    consumer_secret: twitter_creds.consumer_secret,
    access_token: twitter_creds.access_token,
    access_token_secret: twitter_creds.access_token_secret
  }
);

//T.post('statuses/update', { status: 'hello world!' }, function(err, data, response) {
//  console.log(data);
//});

T.get('search/tweets', { q: 'christmas since:2015-12-26', count: 10 }, function(err, data, response) {
  data.statuses.map(function(tweet){console.log(tweet.text);});
});

//var stream = T.stream('user');
//
//var entities = {};
//
//stream.on('tweet', function (tweet) {
//  console.log(tweet.entities);
//  entities = tweet.entities;
//})
