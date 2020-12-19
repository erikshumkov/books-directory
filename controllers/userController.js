const User = require("../models/user")
const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

const user_details = async (req, res) => {
  const user = req.user
  res.render("user", { user, route: "profile", path: req.path })
}

const user_edit_get = async (req, res) => {
  const user = req.user
  res.render("edit", { user, route: "profile", path: req.path })
}

const user_newpassword_get = async (req, res) => {
  const user = req.user
  res.render("newpass", { user, route: "profile", path: req.path })
}

const user_create_post = async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.cookie("jwt", token, { httpOnly: true })
    res.status(201).json({ user, token })
  } catch (e) {
    res.status(500).json(e)
  }
}

const user_login_post = async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({ email })
    const token = await user.generateAuthToken()
    const errors = validationResult(req)

    if (!user) {
      return res.status(404).send()
    }

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const compare = await bcrypt.compare(password, user.password)

    if (compare) {
      res.cookie("jwt", token, { httpOnly: true })
      res.json({ user: user._id })
    } else {
      res.json({ msg: "Email or password is not correct. Please try again." })
    }
  } catch (error) {
    res.status(500).json({ error: "Invalid credentials. Please try again." })
  }
}

const user_edit_patch = async (req, res) => {
  const updates = Object.keys(req.body)

  try {
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()
    res.json({ user: req.user })
  } catch (e) {
    res.status(500).send()
  }
}

const user_delete = async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch (e) {
    res.status(500).send()
  }
}

const user_logout_get = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token.token !== req.token)
    res.cookie("jwt", "", { maxAge: 1 })
    await req.user.save()

    res.redirect("/login")
  } catch (e) {
    res.status(500).send()
  }
}

const user_logoutAll_get = async (req, res) => {
  try {
    req.user.tokens = []
    res.cookie("jwt", "", { maxAge: 1 })
    await req.user.save()

    res.redirect("/login")
  } catch (e) {
    res.status(500).send()
  }
}

module.exports = {
  user_details,
  user_create_post,
  user_delete,
  user_edit_get,
  user_newpassword_get,
  user_edit_patch,
  user_logout_get,
  user_login_post,
  user_logoutAll_get
}
