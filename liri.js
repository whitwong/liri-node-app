//Libraries to require
var keys = require("./keys.js");
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");

//Lookup variable
var lookup = {
	//Function to request and display tweets from user twitter account
	"my-tweets": function(){
		var client = new Twitter(keys.twitterKeys);
		var params = {screen_name: 'Whitney56113545'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
			//console.log(tweets); //Used to view returned object
		  if (!error && response.statusCode === 200) {
		  	for (var i=0; i<tweets.length; i++) {
		  		console.log("Tweet: " + tweets[i].text + " ---- created at " + tweets[i].created_at);
		  	}
		  }
		});
	},
	//Function that takes song name input and searches spotify. Displays song information.
	"spotify-this-song": function(args){
		var spotify = new Spotify(keys.spotifyKeys);
		var songSearch = "";
		if (args.length > 1){
			songSearch = args.join("+");
		}
		else if (args.length === 1){
			songSearch = args.join();
		}
		else{
			songSearch = "The+Sign+Ace+of+Base";
		}
		spotify.search({ type: 'track', query: songSearch }, function(error, data) {
		  if (error) {
		    return console.log('Error occurred: ' + error);
		  }
			// console.log(JSON.stringify(data, null, 2)); //Used to review JSON object
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
			console.log("Song: " + data.tracks.items[0].name);
			console.log("Preview Song Link: " + data.tracks.items[0].external_urls.spotify);
			console.log("Album: " + data.tracks.items[0].album.name);
		});
	},
	//Function that takes movie name input and searches OMDB. Displays movie information.
	"movie-this": function(args){
		var movieSearch = "";
		if (args.length > 1){
			movieSearch = args.join("+");
		}
		else if (args.length === 1){
			movieSearch = args.join();
		}
		else{
			movieSearch = "Mr.+Nobody";
		}
		var queryURL = "http://www.omdbapi.com/?apikey=40e9cece&t=" + movieSearch;
		request(queryURL, function(error, response, body){
			if (!error && response.statusCode === 200){
				// console.log(JSON.parse(body)); //Used to review JSON object.
				var parsed = JSON.parse(body);
				console.log("Movie Title: " + parsed.Title);
				console.log("Release Year: " + parsed.Year);
				console.log("IMDB Rating: " + parsed.imdbRating);
				console.log("Country of Production: " + parsed.Country);
				console.log("Movie Language: " + parsed.Language);
				console.log("Plot: " + parsed.Plot);
				console.log("Actors: " + parsed.Actors);
				console.log("Movie Website: " + parsed.Website);
			}
		});
	},
	//Function that reads random.txt and executes function listed in the file.
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

//Takes user input and performs requested function
lookup[process.argv[2]](process.argv.slice(3));

//Function that logs console searches to log.txt file
fs.appendFile("log.txt", process.argv, function(error){
  if (error) {
    console.log(error);
  }
  console.log("Content Added!");
});