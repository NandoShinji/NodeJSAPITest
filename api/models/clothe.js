var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var clotheSchema = new Schema({
    clotheName: String,
    user: { type: mongoose.Types.ObjectId, ref: 'User' }
});

var Clothe = mongoose.model('Clothe', clotheSchema);

module.exports = Clothe;