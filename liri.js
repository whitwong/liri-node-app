//Libraries
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Lookup variable
var lookup = {
	"my-tweets": function(){
		var client = new Twitter(keys.twitterKeys);
		var params = {screen_name: 'Whitney56113545'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			//console.log(tweets);
		  if (!error && response.statusCode === 200) {
		  	for (var i=0; i<tweets.length; i++) {
		  		console.log("Tweet: " + tweets[i].text + " ---- created at " + tweets[i].created_at);
		  	};
		  };
		});
	},
	"spotify-this-song": function(args){
		var spotify = new Spotify(keys.spotifyKeys);
		var songSearch = "";
		for (var i=0; i<args.length; i++){
			if (i>0 && i<args.length){
				songSearch = songSearch + "+" + args[i];
			}
			else{
				songSearch = args[i];
			}
		};
		if (args == ""){
			songSearch = "The+Sign+Ace+of+Base";				
		}
		spotify.search({ type: 'track', query: songSearch }, function(error, data) {
		  if (error) {
		    return console.log('Error occurred: ' + error);
		  }
			//console.log(JSON.stringify(data, null, 2)); 
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
			console.log("Preview Song Link: " + data.tracks.items[0].external_urls.spotify);
			console.log("Album: " + data.tracks.items[0].album.name);
		});
	},
	"movie-this": function(args){
		var movieSearch = "";
		for (var i=0; i<args.length; i++){
			if (i>0 && i<args.length) {
				movieSearch = movieSearch + "+" + args[i];
			}
			else{
				movieSearch = args[i];				
			}
		};
		if (args == ""){
			movieSearch = "Mr.+Nobody";
		}
		var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movieSearch;
		request(queryURL, function(error, response, body){
			if (!error && response.statusCode === 200){
				// console.log(JSON.parse(body));
				var parsed = JSON.parse(body);
				console.log("Movie Title: " + parsed.Title);
				console.log("Release Year: " + parsed.Year);
				console.log("IMDB Rating: " + parsed.imdbRating);
				console.log("Country of Production: " + parsed.Country);
				console.log("Movie Language: " + parsed.Language);
				console.log("Plot: " + parsed.Plot);
				console.log("Actors: " + parsed.Actors);
				console.log("Movie Website: " + parsed.Website);
			};
		});
	},
	"do-what-it-says": function(){
		fs.readFile("random.txt", "utf8", function(error, data){
		  if (error) {
		    return console.log('Error occurred: ' + error);
		  }
		  if (data.indexOf(",") != -1) {
			  var dataArr = data.split(",");
				var argFunc = dataArr[0];
			  var args = dataArr[1].split(" ");
			  lookup[argFunc](args);	
		  }
		  else{
		  	lookup[data]("");
		  }
		});
	}
};

lookup[process.argv[2]](process.argv.slice(3));

//Log console searches to log.txt file
fs.appendFile("log.txt", process.argv, function(error){
  if (error) {
    console.log(error);
  }
  console.log("Content Added!");
});