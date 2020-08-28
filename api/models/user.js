var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var userSchema = new Schema({
    name: String,
    cmt: { type: mongoose.Types.ObjectId, ref: 'Cmt' },
    clothe: [{ type: mongoose.Types.ObjectId, ref: 'Clothe' }]
});

var User = mongoose.model('User', userSchema);

module.exports = User;