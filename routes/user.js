const express = require("express")
const { body } = require("express-validator")
const userController = require("../controllers/userController")
const { auth } = require("../middleware/auth")
const router = express.Router()

router.post("/", [
  body("email").isEmail().withMessage("Provide a valid email address"),
  body("password").isLength({ min: 7 }).withMessage("Password must be at least 7 characters long.")
], userController.user_create_post)
router.post("/login", [
  body("email").isEmail().withMessage("Invalid credentials."),
  body("password").isLength({ min: 7 }).withMessage("Password must be at least 7 characters long.")
], userController.user_login_post)
router.get("/logout", auth, userController.user_logout_get)
router.get("/logoutAll", auth, userController.user_logoutAll_get)
router.get("/me", auth, userController.user_details)
router.get("/me/edit", auth, userController.user_edit_get)
router.get("/me/newpass", auth, userController.user_newpassword_get)
router.patch("/me", auth, userController.user_edit_patch)
router.delete("/me", auth, userController.user_delete)

module.exports = router