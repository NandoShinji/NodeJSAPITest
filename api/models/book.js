var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var bookSchema = new Schema({
  ma: String,
  title: String,
  cost: Number,
  genre: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Genre",
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
});

var Book = mongoose.model("Book", bookSchema);

module.exports = Book;
