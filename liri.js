require("dotenv").config();
var fs = require("fs");
var axios = require("axios");
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
 
var command = process.argv[2];
var query = process.argv[3];

doCommand();

function doCommand() {
    if (command === "do-what-it-says") {
        fs.readFile('random.txt', "utf8", function(err, data) {
            command = data.split(",")[0];
            query = data.split(",")[1];
            console.log('Running command "' + command + ' ' + query + '"');
            doCommand();
        });   
    }

    if (command === "spotify-this-song") { 
        if (query == undefined) {
            query = "Africa";
            console.log("No query given - defaulting to 'Africa'")
        }
        spotify.search({ type: 'track', query: query, limit:1 }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        
        var firstResult = data.tracks.items[0];
        var songName = firstResult.name;
        var artists = [];
        for (var i = 0; i < firstResult.artists.length; i++) {
            artists.push(firstResult.artists[i].name);
        }
        var albumName = firstResult.album.name;
        var songUrl = firstResult.external_urls.spotify;

        console.log("");
        console.log(songName + " by " + artists.join(", "));
        console.log(albumName);
        console.log(songUrl);
        });
    } else if (command === "concert-this") {
        if (query == undefined) {
            query = "Weird Al";
            console.log("No artist given - defaulting to 'Weird Al' Yankovic");
        }
        axios.get("https://rest.bandsintown.com/artists/" + query + "/events?app_id=codingbootcamp")
        .then(function (response) {
            for (var j = 0; j < response.data.length; j++) {
                console.log("");
                console.log(response.data[j].venue.name);
                if (response.data[j].venue.region == "") {
                    console.log(response.data[j].venue.city + ", "  + response.data[j].venue.country);
                } else {
                    console.log(response.data[j].venue.city + ", " + response.data[j].venue.region + ", " + response.data[j].venue.country);
                }
                console.log(moment(response.data[j].datetime).format("MM/DD/YYYY"));
            }
        })
        .catch(function (error) {
            console.log(error);
        });
    } else if (command === "movie-this") {
        if (query == undefined) {
            console.log("No query given - defaulting to 'Spider-Verse'");
            query = "Spider-Verse";
        }
        axios.get("http://www.omdbapi.com/?t=" + query + "&apikey=trilogy")
        .then(function (response) {
            console.log("");
            console.log(response.data.Title + " (" + response.data.Year + ")")
            console.log("Metacritic: " + response.data.Metascore + "/100, IMDb: " + response.data.imdbRating +"/10");
            console.log(response.data.Country + ", " + response.data.Language);
            console.log("");
            console.log('"' + response.data.Plot + '"');
            console.log("Starring: " + response.data.Actors);
        })
        .catch(function (error) {
            console.log(error);
        });
    }

}