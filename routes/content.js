var express = require('express');
var router = express.Router();
var Youtube = require('youtube-api');

var token = "";

/* GET home page. */
router.get('/search', function(req, res) {

    var query = req.query.q;
    
    Youtube.authenticate({
        type: 'key',
        token: 'AIzaSyAtNCt3kPCy47KN7ySqlyKgEDLYvdPCa9c'
    });

    Youtube.search.list({
        part: "snippet",
        q: query,
        type: "video"
    }, function(err, data) {
        console.log(err || data);
    });
});

router.get('/process_youtube', function(req, res) {
    var query = req.query.code;



module.exports = router;
