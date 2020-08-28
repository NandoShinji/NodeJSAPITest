var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var genreSchema = new Schema({
    id: String,
    name: String,
    listBook: [{ type: Schema.Types.ObjectId, ref: 'Book' }]
})

module.exports = mongoose.model('Genre', genreSchema)