const express = require("express")
const authController = require("../controllers/authController")
const router = express.Router()

router.get("/login", authController.auth_login_get)
router.get("/signup", authController.auth_signup_get)

module.exports = router