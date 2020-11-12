const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const booksSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  isbn: {
    type: Number
  }
}, { timestamps: true })

const Book = mongoose.model("Book", booksSchema)

module.exports = Book;