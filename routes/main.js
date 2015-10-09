var express = require('express');
var router = express.Router();
var Youtube = require('youtube-api');
var http = require('http');

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var clientID = "200132650084-8f3piddqoshs5dh78h3fuscf1s2sipuo.apps.googleusercontent.com";
var clientSecret = "c-12I2MeUehU1TFHicTSQabQ";
var redirect = "http://localhost:3000/main";
var oauth2Client = new OAuth2(clientID, clientSecret, redirect);

var test_id = "5531b00caaf30f7f3da1b219";
var Users = require('../models/users.js').Users;

router.get('/', function(req, res) {

    var code = req.query.code;
    var sess = req.session;

    //If accessToken is set to session, get it!
    if (sess.accessToken) {
        res.render('main', { title: "Main", token: sess.accessToken });
    } else {
        if (code) {
            oauth2Client.getToken(code, function(err, newTokens) {
                if (!err) {
                    sess.accessToken = newTokens.access_token;
                    res.render('main', { title: "Main", token: sess.accessToken });
                } else {
                    console.log(err);
                    //handle token error
                }
            });
        } else {
            //handle user navigating to /main w/o token set or code query
        }
    }
});


router.get('/search', function(req, res) {

    var sess = req.session;
    var token = sess.accessToken;
    var query = encodeURI(req.query.q);

    var options = {
        port: 3000,
        path: "/api/search?q=" + query + "&token=" + token
    };

    var searchResults = "";
    var request = http.request(options, function(results) {
        results.setEncoding('utf8');

        results.on('data', function(text) {
            searchResults += text
        });

        results.on('end', function() {
            var results = JSON.parse(searchResults);
            res.render('search' + (req.xhr ? "" : "_full"), {
                token: token,
                results: results.items
            });
            //res.send(results.kind);
        });
    });

    request.on('error', function(e) {
        //handle api request error
        console.log(e);
    });

    request.end();
});


router.get('/library', function(req, res) {

    Users.findById(test_id, function(err, user) {
       if(err) {
          //handle error
       } else {
          res.render('library' + (req.xhr ? "" : "_full"), {userInfo: user});
       }
    });
}); 


module.exports = router;
