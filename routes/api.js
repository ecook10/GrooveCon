var express = require('express');
var router = express.Router();
//var Youtube = require('youtube-api');

var google = require('googleapis');
var youtube = google.youtube('v3');
var OAuth2 = google.auth.OAuth2;
var clientID = "200132650084-8f3piddqoshs5dh78h3fuscf1s2sipuo.apps.googleusercontent.com";
var clientSecret = "c-12I2MeUehU1TFHicTSQabQ";
var redirect = "http://localhost:3000/main";
var oauth2Client = new OAuth2(clientID, clientSecret, redirect);

var Users = require('../models/users.js').Users;


/* GET search results from YouTube API */
router.get('/search', function(req, res) {

    var query = req.query.q;
    var token = req.query.token;

    oauth2Client.setCredentials({
        access_token: token
    });
    
    youtube.search.list({
        part: 'snippet',
        q: query,
        type: 'video',
        auth: oauth2Client
    }, function(err, results) {
        if (err) {
            res.status(400);
            console.log(err);
            //handle youtube search error
        } else {
            res.status(200).send(results);
        }
    });
});

/* GET video info from YouTube API */
router.get('/video', function(req, res) {

    var videoId = req.query.id;
    var token = req.query.token;

    oauth2Client.setCredentials({
        access_token: token
    });

    youtube.videos.list({
        part: 'snippet,contentDetails',
        id: videoId,
        auth: oauth2Client
    }, function(err, results) {
        if (err) {
            res.status(400);
            console.log(err);
            //handle error better...
        } else {
            res.status(200).send(results);
        }
    });
});

/* POST video info to user library */
router.post('/library', function(req, res) {
    
    var data = {
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
        genre: req.body.genre,
        source: "youtube"
    };

    //TODO: Pass in id from browser
    var id = "5531b00caaf30f7f3da1b219";
    
    Users.findById(id, function(err, user) {
        user.library.push(data);

        user.save(function(err) {
            if (err) {
                res.status(400).send("database fucked up");
            } else {
                res.status(200).send("Saved!!!");
            }
        });
    });
    
});


module.exports = router;
