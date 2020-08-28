module.exports = function (app) {
    const todoList = require('../controllers/todoListController')
    const upload = require('../middleware/multerModel')

    app.route('/tasks')
        .get(todoList.list_all_tasks)
        .post(todoList.create_a_task)

    app.route('/tasks/:matma')
        .get(todoList.read_a_task)
        .put(todoList.update_a_task)
        .delete(todoList.delete_a_task)

    app.route('/search')
        .get(todoList.read_a_task_query)

    app.route('/movie')
        .get(todoList.movie_pagination)

    app.route('/movie/search')
        .get(todoList.search_movie)

    app.route("/genres")
        .get(todoList.read_all_genres)
        .post(todoList.create_genres)

    app.route('/books')
        .get(todoList.read_all_books)
        .post(todoList.create_book)

    app.route('/genres/:genre')
        .put(todoList.update_genre)
        .delete(todoList.delete_genre)

    app.route('/books/:book')
        .put(todoList.update_book)
        .delete(todoList.delete_book)

    app.route('/users')
        .get(todoList.read_all_users)
        .post(todoList.create_user)

    app.route('/users/:userID')
        .delete(todoList.delete_user)

    app.route('/clothes/:clotheID')
        .delete(todoList.delete_clothe)

    app.route('/upload')
        .post(upload.any(), todoList.uploadFile)
};