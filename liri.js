//Load NPMs and modules
var Twitter = require("twitter");
var Spotify = require("node-spotify-api");
var request = require("request");
var fs = require("fs");
var keys = require("./keys.js");
var colors = require('colors');

var inputCommand = process.argv[2];
var commandParam = process.argv[3];


var twitterKeys = keys.twitterKeys;
var tweetsArray = [];
var client = new Twitter({
  consumer_key: twitterKeys.consumer_key,
  consumer_secret: twitterKeys.consumer_secret,
  access_token_key: twitterKeys.access_token_key,
  access_token_secret: twitterKeys.access_token_secret
});

var spotify = new Spotify(require('./keys.js').spotifyKeys);
var defaultSong = "The Sign";

var defaultMovie = "Mr. Nobody";


function Commands(command, commandParam){

	//console.log(commandParam);

	switch(command){

	case 'my-tweets':
		myTweets(); break;
	case 'spotify-this-song':

		if(commandParam === undefined){
			commandParam = defaultSong;
		}     
		spotifyThis(commandParam); break;
	case 'movie-this':
		
		if(commandParam === undefined){
			commandParam = defaultMovie;
			// console.log("If you haven't watched 'Mr. Nobody,' then you should, it's on Netflix!")
		}    
		movieThis(commandParam); break;
	case 'do-what-it-says':
		doWhatItSays(); break;
	default: 
		console.log("Hello, I'm Liri.\nPlease type one of my following commands: \nmy-tweets \nspotify-this-song \nmovie-this \ndo-what-it-says".magenta);
}


}

function myTweets(){

	var params = {screen_name: 'stephen22254052', count: 20, exclude_replies:true, trim_user:true};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
				if (!error) {
					//console.log("tweet tweet");
					tweetsArray = tweets;

					for(i=0; i<tweetsArray.length; i++){
						console.log("Created at: " + tweetsArray[i].created_at);
						console.log("Text: " + tweetsArray[i].text);
						console.log('--------------------------------------'.rainbow);
					}
				}
				else{
					console.log(error);
				}
	});

}

function spotifyThis(song){

	payload = {type: 'track', query: song,};
	spotify.search(payload, function(err, data) {
    if (err) {
        console.log('Error occurred: ' + err);
        return;
    }

    var song = data.tracks.items[0];
    console.log("------Artists-----".bgCyan);
    for(i=0; i<song.artists.length; i++){
    	console.log(song.artists[i].name);
    }

    console.log("-----Song Name----".bgCyan);
    console.log(song.name);

	console.log("---Preview Link---".bgCyan);
    console.log(song.preview_url);

    console.log("-------Album------".bgCyan);
    console.log(song.album.name);

	});

};

function movieThis(movieName){

var payload = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy"

	request(payload, function(error, response, body) {
		if (!error && response.statusCode === 200) {
			var movieData = JSON.parse(body);
			if(movieData.Title != undefined){

	    	console.log("--------Title-----------".bgYellow);
	    	console.log("Title: "+movieData.Title);

	    	console.log("--------Year -----------".bgYellow);
	    	console.log("Year: "+movieData.Year);

	   		console.log("--------Rating-----------".bgYellow);
	   		console.log("IMDB Rating: " +movieData.imdbRating);

	   		console.log("-----Country Produced----".bgYellow);
	   		console.log("Produced in: "+movieData.Country);
	   		
	   		console.log("--------Plot-------------".bgYellow);
	   		console.log("Plot: "+movieData.Plot);

	   		console.log("--------Actors-----------".bgYellow);
	   		console.log("Actors: "+movieData.Actors);
	    	
	    };


  	}
  	else{
  		console.log(error);
  	}

	});
}


function doWhatItSays(){
	fs.readFile('random.txt', 'utf8', function(err, data){

		if (err){ 
			return console.log(err);
		}

		var dataArr = data.split(',');

		Commands(dataArr[0], dataArr[1]);
	});
}



Commands(inputCommand, commandParam);
