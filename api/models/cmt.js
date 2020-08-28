var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    number: Number,
    user: { type: mongoose.Types.ObjectId, ref: 'User' }
});

var Cmt = mongoose.model('Cmt', userSchema);

module.exports = Cmt;