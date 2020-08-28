var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var fileSchema = new Schema({
    originalname: {
        type: String
    },
    filename: {
        type: String
    },
    encoding: {
        type: String
    },
    mimetype: {
        type: String
    },
    destination: {
        type: String
    },
    path: {
        type: String
    },
    size: {
        type: Number
    },
    created: {
        type: Date,
        default: Date.now
    }
});



module.exports = mongoose.model('File', fileSchema);