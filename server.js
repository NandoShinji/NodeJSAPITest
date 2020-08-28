var express = require('express'),
    app = express(),
    http = require('http').createServer(app),
    port = process.env.port || 8080,
    mongoose = require('mongoose'),
    Movie = require('./api/models/movie'),
    bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var routes = require('./api/routes/todoListRoutes');
routes(app);

var mongoDB = 'mongodb://localhost:27017/movie';
var mongoDB_Book = 'mongodb://localhost:27017/QuanLySach';
const option = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}
mongoose.Promise = global.Promise;
mongoose.connect(mongoDB_Book, option, function (err, db) {
    console.log('Connected!!!')
})

app.use(function (req, res) {
    res.status(404).send({ url: req.originalUrl + 'not found' })
});

app.listen(port);

console.log('todo List RESTful API server started on!!!!' + port);