var express = require('express');
var router = express.Router();

var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var clientID = "200132650084-8f3piddqoshs5dh78h3fuscf1s2sipuo.apps.googleusercontent.com";
var clientSecret = "c-12I2MeUehU1TFHicTSQabQ";
var redirect = "http://localhost:3000/main";
var scope = "https://www.googleapis.com/auth/youtube";

/* GET home page. */
router.get('/', function(req, res) {

    res.render('login', { title: 'Login' });
});

router.post('/process_login', function(req, res) {

    var oauth2Client = new OAuth2(clientID, clientSecret, redirect);

    var url = oauth2Client.generateAuthUrl({
        scope: scope
    });

    res.status(200).send(url);
});

module.exports = router;
