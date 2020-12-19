const Book = require("../models/books")

// Get all books from one user
const book_index = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id }).sort({ _id: -1 })

    if (!books) {
      return res.status(404).send()
    }

    res.render("books/index", { books, user: req.user, route: undefined })
  } catch (e) {
    res.status(500).send(e)
  }
}

// Not working atm.
const book_single = async (req, res) => {
  const _id = req.params.id
  console.log("book single");

  try {
    const book = await Book.findOne({ _id, owner: req.user._id })

    if (!book) {
      return res.status(404).send()
    }

    res.send(book)
  } catch (e) {
    res.status(500).send(e)
  }
}

// Get values from book inside form / update page
const book_update_get = async (req, res) => {
  try {
    const books = await Book.find({ owner: req.user._id }).sort({ _id: -1 })
    const query = req.query

    if (!books) {
      return res.status(404).send()
    }

    res.render("books/update", { books, user: req.user, query, route: undefined })
  } catch (e) {
    res.status(500).send(e)
  }
}

// POST Add new book
const book_create_post = async (req, res) => {
  try {
    const book = new Book({
      ...req.body,
      owner: req.user._id
    })
    await book.save()
    res.status(201).redirect("/books")
  } catch (e) {
    res.status(500).send(e)
  }
}

// PUT update book
const book_update_put = async (req, res) => {
  const bookTitle = req.params.title
  const updates = Object.keys(req.body)

  try {
    const book = await Book.findOne({ title: bookTitle, owner: req.user._id })

    if (!book) {
      return res.status(404).send()
    }

    updates.forEach(update => book[update] = req.body[update])
    await book.save()
    // res.send(book)
    res.json({ redirect: "/books" })
  } catch (e) {
    res.status(500).send(e)
  }
}

// DELETE remove book
const book_delete = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if (!book) {
      return res.status(404).send()
    }

    // res.send(book)
    res.json({ redirect: "/books" })
  } catch (e) {
    res.status(500).send(e)
  }
}

module.exports = {
  book_index,
  book_single,
  book_update_get,
  book_create_post,
  book_update_put,
  book_delete
}