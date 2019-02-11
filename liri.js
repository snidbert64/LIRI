require("dotenv").config();
var axios = require("axios");
var moment = require('moment');
var keys = require("./keys.js");
var Spotify = require('node-spotify-api');
var spotify = new Spotify(keys.spotify);
 
var command = process.argv[2];
var query = process.argv[3];

if (command === "spotify-this-song") { 
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
}