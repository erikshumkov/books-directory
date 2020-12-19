const User = require("../models/user")

const auth_login_get = async (req, res) => {
  res.render("login")
}

const auth_signup_get = async (req, res) => {
  res.render("signup")
}

module.exports = {
  auth_login_get,
  auth_signup_get
}