const express = require("express")
const bookController = require("../controllers/bookController")
const { body } = require("express-validator")
const { auth } = require("../middleware/auth")

const router = express.Router()

router.get("/", auth, bookController.book_index)
// router.get("/:id", auth, bookController.book_single)
router.get("/search/", auth, bookController.book_search_get)
router.get("/update/", auth, bookController.book_update_get)
router.post("/",
  [
    body("title", "Title is required")
      .not()
      .isEmpty(),
    body("author", "Author is required.")
      .not()
      .isEmpty(),
    body("rating", "Rating is required. Need to be a number between 0 and 5.")
      .isInt({ min: 0, max: 5 }),
    body("imgURL", "Need to be a valid URL")
      .optional({ checkFalsy: true })
      .isURL()
  ],
  auth, bookController.book_create_post)
router.put("/update/:title",
  [
    body("title", "Title is required")
      .not()
      .isEmpty(),
    body("author", "Author is required.")
      .not()
      .isEmpty(),
    body("rating", "Need to be a number between 0 and 5.")
      .isInt({ min: 0, max: 5 }),
    body("imgURL", "Need to be a valid URL")
      .optional({ checkFalsy: true })
      .isURL()
  ],
  auth, bookController.book_update_put)
router.delete("/:id", auth, bookController.book_delete)

module.exports = router