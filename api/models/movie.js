var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var movieSchema = new Schema({
    popularity: Number,
    video: Boolean,
    vote_count: Number,
    vote_average: Number,
    title: String,
    release_date: Date,
    original_language: String,
    original_title: String,
    genre_ids: Array,
    backdrop_path: String,
    adult: Boolean,
    overview: String,
    poster_path: String
});


module.exports = mongoose.model('Movie', movieSchema);