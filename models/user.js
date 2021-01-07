require("dotenv").config()
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const Schema = mongoose.Schema;
const Book = require("./books")
const validator = require("express-validator")

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email required"],
    unique: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: "Please enter a valid email address"
    }
  },
  password: {
    type: String,
    required: [true, "Password required"],
    trim: true
  },
  name: {
    type: String,
    default: "No name",
    trim: true
  },
  age: {
    type: Number,
    default: 0
  },
  tokens: [{
    token: {
      type: String,
      required: true
    }
  }],
  avatar: {
    type: Buffer
  }
}, {
  timestamps: true
})

userSchema.virtual("books", {
  ref: "Book",
  localField: "_id",
  foreignField: "owner"
})

userSchema.methods.toJSON = function () {
  const user = this
  const userObject = user.toObject()

  delete userObject.password
  delete userObject.tokens
  delete userObject.avatar

  return userObject
}

userSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({ _id: user._id.toString() }, `${process.env.SECRET}`)

  user.tokens = user.tokens.concat({ token })
  await user.save()

  return token
}

userSchema.pre("save", async function (next) {
  const user = this

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8)
  }

  next()
})

userSchema.pre("remove", async function (next) {
  const user = this
  await Book.deleteMany({ owner: user._id })
  next()
})

const User = mongoose.model("User", userSchema)

module.exports = User