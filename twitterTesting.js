var Twit = require('twit'),
    fs = require('fs'),
    nconf = require('nconf');

nconf.file('config.json');
var twitter_creds = nconf.get('twitter_creds');

var T = new Twit({consumer_key: twitter_creds.consumer_key,
    consumer_secret: twitter_creds.consumer_secret,
    access_token: twitter_creds.access_token,
    access_token_secret: twitter_creds.access_token_secret});
);

// Test stream API to monitor for changes
var stream = T.stream('user');

var tweetSave,
    replySave;

stream.on('tweet', function (tweet) {
  console.log('tweet received');
  if (tweet.in_reply_to_screen_name == 'asciify') {
    console.log('it\'s for me!');
    var fromUser = tweet.user.screen_name;
    var params = {
                    status: '@' + fromUser + ' right back at ya',
                    in_reply_to_status_id: tweet.id_str
                 };

    console.log(params);
    console.log(tweet);

    T.post('statuses/update', params, function(err, data, response) {
      console.log('tried to post a reply')
      replySave = data;
    });
  }
  tweetSave = tweet;
});

// Hello world tweet from account associated with access token above
T.post('statuses/update', { status: '@quanticleco  here\'s your image back!', in_reply_to_status_id: '689270714109661184', media_ids: '689270713413337088'}, function(err, data, response) {
  console.log(data);
});

// Test search for random tweets from a query
T.get('search/tweets', { q: 'christmas since:2015-12-26', count: 10 }, function(err, data, response) {
  data.statuses.map(function(tweet){console.log(tweet.text);});
});

// Nuke the last 200 tweets you've sent (useful for cleaning up after bugs...)
T.get('statuses/user_timeline', {screen_name:'asciify',count:200},function(err, data, response) {
  data.map(function(tweet){
    var postString = 'statuses/destroy/' + tweet.id_str;
    T.post(postString,function(err,data,response){console.log('deleted ' + tweet.id_str);});
  });
});





// Sample media tweet
var b64content = fs.readFileSync('./test-images/tree.jpg', { encoding: 'base64' });

// first we must post the media to Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {

  // now we can reference the media and post a tweet (media will attach to the tweet)
  var mediaIdStr = data.media_id_string
  var params = { status: '@quanticleco loving life #nofilter', in_reply_to_status_id: '689270714109661184', media_ids: [mediaIdStr] }

  T.post('statuses/update', params, function (err, data, response) {
    console.log(data)
  });
});

/* Tweet object format:

{ created_at: 'Tue Jan 19 02:18:38 +0000 2016',
  id: 689270714109661200,
  id_str: '689270714109661184',
  text: '@asciify testing with media https://t.co/h96nMPXUqZ',
  source: '<a href="http://twitter.com" rel="nofollow">Twitter Web Client</a>',
  truncated: false,
  in_reply_to_status_id: null,
  in_reply_to_status_id_str: null,
  in_reply_to_user_id: 4699429333,
  in_reply_to_user_id_str: '4699429333',
  in_reply_to_screen_name: 'asciify',
  user:
   { id: 2996535469,
     id_str: '2996535469',
     name: 'Quanticle',
     screen_name: 'quanticleco',
     location: null,
     url: null,
     description: null,
     protected: false,
     verified: false,
     followers_count: 0,
     friends_count: 0,
     listed_count: 0,
     favourites_count: 0,
     statuses_count: 6,
     created_at: 'Mon Jan 26 03:55:27 +0000 2015',
     utc_offset: null,
     time_zone: null,
     geo_enabled: false,
     lang: 'en',
     contributors_enabled: false,
     is_translator: false,
     profile_background_color: 'C0DEED',
     profile_background_image_url: 'http://abs.twimg.com/images/themes/theme1/bg.png',
     profile_background_image_url_https: 'https://abs.twimg.com/images/themes/theme1/bg.png',
     profile_background_tile: false,
     profile_link_color: '0084B4',
     profile_sidebar_border_color: 'C0DEED',
     profile_sidebar_fill_color: 'DDEEF6',
     profile_text_color: '333333',
     profile_use_background_image: true,
     profile_image_url: 'http://pbs.twimg.com/profile_images/689261967098441728/U56zN_ef_normal.png',
     profile_image_url_https: 'https://pbs.twimg.com/profile_images/689261967098441728/U56zN_ef_normal.png',
     default_profile: true,
     default_profile_image: false,
     following: null,
     follow_request_sent: null,
     notifications: null },
  geo: null,
  coordinates: null,
  place: null,
  contributors: null,
  is_quote_status: false,
  retweet_count: 0,
  favorite_count: 0,
  entities:
   { hashtags: [],
     urls: [],
     user_mentions: [ [Object] ],
     symbols: [],
     media: [ [Object] ] },
  extended_entities: { media: [ [Object] ] },
  favorited: false,
  retweeted: false,
  possibly_sensitive: false,
  filter_level: 'low',
  lang: 'en',
  timestamp_ms: '1453169918931' }

  tweetSave.entities.user_mentions
[ { screen_name: 'asciify',
    name: 'Asciify',
    id: 4699429333,
    id_str: '4699429333',
    indices: [ 0, 8 ] } ]

    tweetSave.entities.media
[ { id: 689270713413337100,
    id_str: '689270713413337088',
    indices: [ 28, 51 ],
    media_url: 'http://pbs.twimg.com/media/CZDID9sVAAA0_4R.png',
    media_url_https: 'https://pbs.twimg.com/media/CZDID9sVAAA0_4R.png',
    url: 'https://t.co/h96nMPXUqZ',
    display_url: 'pic.twitter.com/h96nMPXUqZ',
    expanded_url: 'http://twitter.com/quanticleco/status/689270714109661184/photo/1',
    type: 'photo',
    sizes:
     { medium: [Object],
       large: [Object],
       thumb: [Object],
       small: [Object] } } ]


*/
