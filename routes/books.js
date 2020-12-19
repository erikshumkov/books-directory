const express = require("express")
const bookController = require("../controllers/bookController")
const { auth } = require("../middleware/auth")

const router = express.Router()

router.get("/", auth, bookController.book_index)
// router.get("/:id", auth, bookController.book_single)
router.get("/update/", auth, bookController.book_update_get)
router.post("/", auth, bookController.book_create_post)
router.put("/update/:title", auth, bookController.book_update_put)
router.delete("/:id", auth, bookController.book_delete)

module.exports = router