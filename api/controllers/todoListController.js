var mongoose = require("mongoose");
var mongoDB = "mongodb://localhost:27017/movie";
var mongoDB_Book = "mongodb://localhost:27017/QuanLySach";
var Author = require("../models/author");
var Book = require("../models/book");
var Genre = require("../models/genre");
var Books = mongoose.model("Book");
var Genres = mongoose.model("Genre");
var User = require("../models/user");
var Cmt = require("../models/cmt");
var Clothe = require("../models/clothe");
var File = require("../models/file");
var Users = mongoose.model("User");
var Cmts = mongoose.model("Cmt");
var Clothes = mongoose.model("Clothe");
var Files = mongoose.model("File");
var Movie = mongoose.model("Movie", "popular");
var Promise = require("bluebird");
// Movie.createIndexes({ '$**': 'text' })

const LIMIT = 5;

const option = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};
var total_document;
Movie.countDocuments({}, function (err, count) {
  total_document = count;
});

exports.list_all_tasks = function (req, res) {
  Movie.find({}, function (err, result) {
    if (err) res.send(err);
    res.json({ movie: result });
  });
};

exports.create_a_task = function (req, res) {
  const genre = new Genre(req.body);

  genre.save(function (err) {
    if (err) res.send(err);

    res.json(book1);
  });

  res.end("Insert Successfully " + JSON.stringify(genre));
};

exports.read_a_task = function (req, res) {
  mongoose.connect(mongoDB, option, function (err, db) {
    if (err) throw err;
    let allAuthors = db.collection("Book");
    allAuthors.findOne({ ma: req.params.ma }, function (err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  });
};

exports.read_a_task_query = function (req, res) {
  mongoose.connect(mongoDB, option, function (err, db) {
    if (err) throw err;
    let allAuthors = db.collection("popular");
    let searchText = req.query.name;
    allAuthors
      .find({ title: { $regex: searchText, $options: "i" } })
      .toArray(function (err, result) {
        if (err) throw err;
        res.json({ search: result });
        db.close();
      });
  });
};

exports.update_a_task = function (req, res) {
  mongoose.connect(mongoDB, option, function (err, db) {
    if (err) throw err;
    let allAuthors = db.collection("Book");
    let updateBook = new Book(req.body);
    // let updateText = { ma: req.params.matma }
    allAuthors.findOneAndUpdate({ ma: req.params.matma }, updateBook, function (
      err,
      result
    ) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  });
};

exports.delete_a_task = function (req, res) {
  mongoose.connect(mongoDB, option, function (err, db) {
    if (err) throw err;
    let allAuthors = db.collection("Book");
    allAuthors.deleteOne(req.params, function (err, result) {
      if (err) throw err;
      res.json(result);
      db.close();
    });
  });
};

exports.movie_pagination = function (req, res) {
  console.log(total_document);
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let total_page = parseInt(Math.ceil(total_document / LIMIT));
  let skip = (page - 1) * LIMIT;
  Movie.find({}, null, { skip: skip, limit: LIMIT }, function (err, result) {
    if (err) res.send(err);

    const finalResult = [
      {
        page: page,
        total_results: total_document,
        total_page: total_page,
        result: result,
      },
    ];
    res.json(finalResult);
  });
};

exports.search_movie = function (req, res) {
  let page = req.query.page ? parseInt(req.query.page) : 1;
  let searchText = req.query.query;
  let skip = (page - 1) * LIMIT;
  Promise.all([
    // Movie.find({ $or: [{ title: { $regex: searchText, $options: 'i' } }, { overview: { $regex: searchText, $options: 'i' } }, {}] }, null, { skip: skip, limit: LIMIT }).exec(),
    // Movie.find({ $or: [{ title: { $regex: searchText, $options: 'i' } }, { overview: { $regex: searchText, $options: 'i' } }, {}] }).countDocuments({})
    Movie.find({ $text: { $search: searchText } }, null, {
      skip: skip,
      limit: LIMIT,
    }).exec(),
    Movie.find({ $text: { $search: searchText } }).countDocuments({}),
  ])
    .spread(function (items, count) {
      const finalResult = {
        page: page,
        total_results: count,
        total_page: parseInt(Math.ceil(count / LIMIT)),
        result: items,
      };
      res.json(finalResult);
    })
    .catch(function (err) {
      res.send(err);
    });
};

exports.create_genres = function (req, res) {
  const genre = new Genres(req.body);
  genre.save(function (err, result) {
    if (err) res.send(err);
    genre.listBook.forEach((id) => {
      Books.findByIdAndUpdate(
        id,
        { $push: { genre: result._id } },
        { useFindAndModify: false },
        function (err) {
          if (err) res.send(err);
        }
      );
    });
    res.send("Success");
  });
};

exports.create_book = function (req, res) {
  const book = new Books(req.body);

  book.save(function (err, result) {
    if (err) res.send(err);

    book.genre.forEach((id) => {
      Genres.findByIdAndUpdate(
        id,
        { $push: { listBook: result._id } },
        { useFindAndModify: false },
        function (err) {
          if (err) res.send(err);
        }
      );
    });
    res.send("Success");
  });
};

exports.update_genre = function (req, res) {
  let genreID = req.params.genre;
  // let newGenre = req.body
  let removeBook = [];
  let addBook = [];
  Genres.findById(genreID).exec(function (err, genre) {
    const stringArr = genre.listBook.map((x) => x.toString());
    req.body.listBook.forEach((item) => {
      if (stringArr.indexOf(item) === -1) {
        genre.listBook.push(item);
        addBook.push(item);
      }
    });

    addBook.forEach((id) => {
      Books.findByIdAndUpdate(
        { _id: id },
        { $push: { genre: genre._id } },
        { useFindAndModify: false },
        function (err) {
          if (err) throw err;
        }
      );
    });

    if (req.body.name) {
      genre.name = req.body.name;
    }
    if (req.body.id) {
      genre.id = req.body.id;
    }

    const newGenre = new Genres(genre);

    Genres.findByIdAndUpdate(
      genreID,
      newGenre,
      { useFindAndModify: false },
      function (err) {
        if (err) throw err;
      }
    );

    res.send("Update success: " + addBook);
  });
};

exports.update_book = function (req, res) {
  let bookID = req.params.book;
  let newBook = req.body;
  let removeGenre = [];
  let addGenre = [];
  Books.findById(bookID).exec(function (err, book) {
    const stringArr = book.genre.map((x) => x.toString());
    stringArr.forEach((item) => {
      if (newBook.genre.indexOf(item) === -1) {
        removeGenre.push(item);
      }
    });

    newBook.genre.forEach((item) => {
      if (stringArr.indexOf(item) === -1) {
        addGenre.push(item);
      }
    });

    removeGenre.forEach((id) => {
      Genres.findByIdAndUpdate(
        { _id: id },
        { $pull: { listBook: book._id } },
        { useFindAndModify: false },
        function (err) {
          if (err) throw err;
        }
      );
    });

    addGenre.forEach((id) => {
      Genres.findByIdAndUpdate(
        { _id: id },
        { $push: { listBook: book._id } },
        { useFindAndModify: false },
        function (err) {
          if (err) throw err;
        }
      );
    });

    Books.findByIdAndUpdate(
      bookID,
      newBook,
      { useFindAndModify: false },
      function (err) {
        if (err) throw err;
      }
    );

    res.send("Update success: " + removeGenre + "---" + addGenre);
  });
};

exports.delete_genre = function (req, res) {
  let genreID = req.params.genre;

  Genres.findByIdAndDelete({ _id: genreID }, function (err, result) {
    if (err) throw err;
    result.listBook.forEach((id) => {
      Books.findByIdAndUpdate(
        id,
        { $pull: { genre: result._id } },
        { useFindAndModify: false },
        function (err) {
          if (err) throw err;
        }
      );
    });
    res.send("Delete genre success");
  });
};

exports.delete_book = function (req, res) {
  let bookID = req.params.book;

  Books.findByIdAndDelete({ _id: bookID }, function (err, result) {
    if (err) throw err;
    result.genre.forEach((id) => {
      Genres.findByIdAndUpdate(
        id,
        { $pull: { listBook: result._id } },
        { useFindAndModify: false },
        function (err) {
          if (err) throw err;
        }
      );
    });
    res.send("Delete book success");
  });
};

exports.read_all_genres = function (req, res) {
  Genres.find({})
    .populate("listBook")
    .exec(function (err, genre) {
      res.json({ allGenres: genre });
    });
};

exports.read_all_books = function (req, res) {
  Books.find({})
    .populate("genre")
    .exec(function (err, book) {
      res.json({ allBook: book });
    });
};

exports.create_user = function (req, res) {
  const newUser = { _id: new mongoose.Types.ObjectId(), name: req.body.name };
  const user = new Users(newUser);

  const userCmt = new Cmts({
    _id: new mongoose.Types.ObjectId(),
    number: req.body.number,
    user: newUser._id,
  });
  user.cmt = userCmt._id;

  userCmt.save(function (err) {
    if (err) throw err;
  });

  req.body.clothe.forEach((item) => {
    const clothes = new Clothes({
      _id: new mongoose.Types.ObjectId(),
      user: newUser._id,
      clotheName: item,
    });
    user.clothe.push(clothes._id);

    clothes.save(function (err) {
      if (err) throw err;
    });
  });

  user.save(function (err, result) {
    if (err) throw err;

    res.send("Create success !!!");
  });
};

exports.read_all_users = function (req, res) {
  Users.find({})
    .populate("cmt")
    .populate("clothe")
    .exec(function (err, user) {
      res.json({ allUser: user });
    });
};

exports.delete_user = function (req, res) {
  let userID = req.params.userID;

  Users.findByIdAndDelete(userID, function (err, user) {
    if (err) throw err;

    Cmts.findByIdAndDelete(user.cmt, function (err) {
      if (err) throw err;
    });

    Clothes.deleteMany({ user: user._id }, function (err) {
      if (err) throw err;
    });

    res.send("Delete Success !!");
  });
};

exports.delete_clothe = function (req, res) {
  const cloteToDelete = req.params.clotheID;

  Clothes.findByIdAndDelete(cloteToDelete, function (err, result) {
    if (err) throw err;

    Users.findByIdAndUpdate(
      { _id: result.user },
      { $pull: { clothe: result._id } },
      { useFindAndModify: false },
      function (err) {
        if (err) throw err;
      }
    );

    res.send("Delete Success !!!");
  });
};

exports.uploadFile = async function (req, res) {
  req.files.forEach((file) => {
    const newFile = new Files(file);

    newFile.save(function (err) {
      if (err) throw err;
    });
  });

  res.send("Success");
};
