require("dotenv").config()
const mongoose = require("mongoose")

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@shumkov.bwm9p.mongodb.net/books-directory?retryWrites=true&w=majority`

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const db = mongoose.connection

module.exports = db