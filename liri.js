var twitterKeys = require('./keys.js')
var Twitter = require('twitter');
var spotify = require('spotify');
var request = require('request');
var nodeArgs = process.argv;
var arg1 = process.argv[2];
var arg2 = process.argv[3];

var client = new Twitter({
  consumer_key: twitterKeys.twitterKeys.consumer_key,
  consumer_secret: twitterKeys.twitterKeys.consumer_secret,
  access_token_key: twitterKeys.twitterKeys.access_token_key,
  access_token_secret: twitterKeys.twitterKeys.access_token_secret
});

// Twitter logic
if (arg1 === 'my-tweets') {
  var params = { screen_name: 'spino725' };
  client.get('statuses/user_timeline', params, function (error, tweets, response) {
    if (error) {
      return console.log(error);
    }
    console.log('Displaying latest tweets from user ' + params.screen_name + ' :\n-------------------------------------------');
    for (var i = 0; i < 5; i++) {
      console.log('Tweet: ' + tweets[i].text);
      console.log('Time tweeted: ' + tweets[i].created_at + '\n--------------------------------');
    }
  });
}
//Spotify logic
else if (arg1 === 'spotify-this-song') {
  var songQuery = '';
  for (var i = 3; i < nodeArgs.length; i++) {
    songQuery += nodeArgs[i] + ' ';
  }
  if (songQuery === '') {
    songQuery = 'The Sign Ace of Base';
  }
  spotify.search({ type: 'track', query: songQuery }, function (err, data) {
    if (err) {
      console.log('Error occurred: ' + err);
      return;
    }
    console.log('Artist name: ' + data.tracks.items[0].artists[0].name);
    console.log('Song name: ' + data.tracks.items[0].name);
    console.log('Preview link: ' + data.tracks.items[0].preview_url);
    console.log('Album name: ' + data.tracks.items[0].album.name);
    console.log('------------------------------------------------');
  });
}
// OMDB logic
else if (arg1 === 'movie-this') {
  var movieName = '';
  for (var i = 3; i < nodeArgs.length; i++) {
    if (i > 3 && i < nodeArgs.length) {
      movieName = movieName + "+" + nodeArgs[i];
    }
    else {
      movieName += nodeArgs[i];
    }
  }
  if (movieName === '') {
    movieName = 'Mr.+Nobody';
  }
  var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&r=json";
  request(queryUrl, function (error, response, body) {
    if (error) {
      return console.log('Error: ' + error);
    }
    else if (!error && response.statusCode === 200) {
      var tomatoUrl = '';
      var newChar = '%20';
      tomatoUrl = movieName.split('+').join(newChar);
      console.log("Title: " + JSON.parse(body).Title);
      console.log("Release date: " + JSON.parse(body).Year);
      console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
      console.log("Country produced in: " + JSON.parse(body).Country);
      console.log("Language: " + JSON.parse(body).Language);
      console.log("Plot: " + JSON.parse(body).Plot);
      console.log("Actors: " + JSON.parse(body).Actors);
      console.log("Rotten Tomatoes rating: " + JSON.parse(body).Ratings[1].Value);
      console.log("Rotten Tomatoes URL: " + 'https://www.rottentomatoes.com/search/?search=' + tomatoUrl);
      console.log("----------------------------------------------------------------------------------------------------");
    }
  });
}
else {
  console.log('Unknown Command\nHere is a list of available commands: \n-------------------\nmy-tweets\nspotify-this-song <song name here>\nmovie-this <movie name here>\ndo-what-it-says\n---------------------')
}