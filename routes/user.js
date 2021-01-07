const express = require("express")
const { body } = require("express-validator")
const userController = require("../controllers/userController")
const { auth } = require("../middleware/auth")
const sharp = require("sharp")
const multer = require("multer")
const User = require("../models/user")
const router = express.Router()

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {

    if (!file.originalname.match(/\.(png|jpeg|jpg)$/)) {
      return cb(new Error("Please upload a avatar in png, jpeg or jpg."))
    }

    cb(undefined, true)
  }
})

router.post("/",
  [
    body("email", "Please include a valid email address")
      .isEmail(),
    body("password", "Please enter a password with at least 7 characters or more.")
      .isLength({ min: 7 })
  ], userController.user_create_post)

router.post("/login",
  [
    body("email", "Invalid user or password.")
      .isEmail(),
    body("password", "Invalid user or password.")
      .isLength({ min: 7 })
  ], userController.user_login_post)


router.post("/me/avatar", auth, upload.single("avatar"), async (req, res) => {
  const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()
  req.user.avatar = buffer
  await req.user.save()
  res.redirect("/users/me")
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})


router.get("/:id/avatar", userController.user_avatar_get)
router.get("/logout", auth, userController.user_logout_get)
router.get("/logoutAll", auth, userController.user_logoutAll_get)
router.get("/me", auth, userController.user_details)
router.get("/me/edit", auth, userController.user_edit_get)
router.get("/me/newpass",
  auth,
  userController.user_newpassword_get)
router.patch("/me", auth, userController.user_edit_patch)
router.delete("/me", auth, userController.user_delete)
router.delete("/me/avatar", auth, userController.user_avatar_delete)

module.exports = router

// [
//   body("password", "Password is required. At least 7 characters and max 30.")
//     .not()
//     .isEmpty()
//     .isLength({ min: 7, max: 30 }),
//   body("password2", "Match password is required.")
//     .not()
//     .isEmpty()
//     .isLength({ min: 7, max: 30 })
// ],