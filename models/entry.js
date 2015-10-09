//Library entry mongoose model

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var entrySchema = new Schema({
    title: String,
    artist: String,
    album: String,
    genre: String,
    source: String
});

exports.Entry = mongoose.model('Entry', entrySchema);

