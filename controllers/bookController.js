const Book = require("../models/books")

const book_index = (req, res) => {
  Book.find((err, books) => {
    res.render("books/index", { books })
  })
}

const book_update_get = (req, res) => {
  Book.find((err, books) => {
    const query = req.query;
    res.render("books/update", { books, query })
  })
}

const book_create_post = (req, res) => {
  const book = new Book(req.body)

  book.save()
    .then(result => res.redirect("/"))
    .catch(err => console.log(err))
}

const book_update_put = async (req, res) => {
  const prevTitle = req.params.title;
  const { title, author, isbn } = req.body;

  const previous = Book.findOne({ title: prevTitle })

  Book.findOneAndUpdate(previous, { title: title || previous.title, author: author || previous.author, isbn: isbn || previous.isbn }, { new: true }, (err, book) => {
    if (err) return console.log(err)
    res.json({ redirect: "/" })
  })
}

const book_delete = (req, res) => {
  Book.findByIdAndDelete(req.params.id)
    .then(result => {
      res.json({ redirect: "/" })
    })
    .catch(err => console.log(err))
}

module.exports = {
  book_index,
  book_update_get,
  book_create_post,
  book_update_put,
  book_delete
}