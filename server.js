require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const db = require("./db/db")
const { render } = require("ejs")
const books = require("./routes/books")
const user = require("./routes/user")
const authRoutes = require("./routes/authRoutes")
const cookieParser = require("cookie-parser")
const { checkUser } = require("./middleware/auth")

const app = express()
const port = process.env.PORT || 3000

db.on("error", console.error.bind(console, "connection error:"))
db.once("open", () => {
  console.log("Connected to MongoDB...")
})

// register view engine
app.set("view engine", "ejs")

// middleware & static files
app.use(express.static("public"))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

// Check if authenticated
app.get("*", checkUser)

// Redirect
app.get("/", (req, res) => {
  res.redirect("/books")
})

// Book routes
app.use("/users", user)
app.use("/books", books)
app.use("/", authRoutes)

// 404 page
app.use((req, res) => {
  res.status(404).send({ route: "404 Not Found" })
})

app.listen(port, () => console.log(`Server running on port ${port}`))