require("dotenv").config()
const express = require("express");
const mongoose = require("mongoose")
const { render } = require("ejs")
const bookRoutes = require("./routes/bookRoutes");

const app = express();
const port = process.env.port || 3000;

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@shumkov.bwm9p.mongodb.net/books-directory?retryWrites=true&w=majority`

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Connected to db")
})

// register view engine
app.set("view engine", "ejs")

// middleware & static files
app.use(express.static("public"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.redirect("/books")
})

// Book routes
app.use("/books", bookRoutes)

app.use((req, res) => {
  res.status(404).send({ route: "404 Not Found" })
})

app.listen(port, () => console.log(`Server running on port ${port}`))