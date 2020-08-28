var mongoose = require('mongoose');

var authorSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: {
        firstName: {
            type: String,
            required: true
        },
        lastName: String
    },
    age: Number,
    created: {
        type: Date,
        default: Date.now
    }
});

var Author = mongoose.model('Author', authorSchema);

module.exports = Author;