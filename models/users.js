//User mongoose model

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var entrySchema = new Schema({
    title: String,
    artist: String,
    album: String,
    genre: String,
    source: String
});

var userSchema = new Schema({
    login: {
        username: String,
        password: String
    },
    settings: Object,
    library: [entrySchema],
    playlists: Array
});

exports.Users = mongoose.model('Users', userSchema);
