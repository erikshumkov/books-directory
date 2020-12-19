require("dotenv").config()
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const auth = async (req, res, next) => {
  try {
    // const token = req.header("Authorization").replace("Bearer ", "")
    const token = req.cookies.jwt;

    if (token) {
      jwt.verify(token, `${process.env.SECRET}`, async (err, decodedToken) => {
        if (err) {
          console.log(err.message)
          res.redirect("/login")
        } else {
          const user = await User.findOne({ _id: decodedToken._id, "tokens.token": token })
          if (!user) {
            throw new Error()
          }

          req.token = token
          req.user = user
          next()
        }
      })
    } else {
      return res.redirect("/login")
    }
  } catch (e) {
    res.status(401).send({ error: "Please authenticate." })
  }
}

const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    const decoded = jwt.verify(token, `${process.env.SECRET}`, async (err, decodedToken) => {
      if (err) {
        console.log(err.message)
        res.locals.user = null
        next()
      } else {
        let user = await User.findById(decodedToken.id)
        res.locals.user = user
        next()
      }
    })
  } else {
    res.locals.user = null
    next()
  }
}

module.exports = { auth, checkUser }