const express = require("express")
const bookController = require("../controllers/bookController")

const router = express.Router();

router.get("/", bookController.book_index)
router.get("/update", bookController.book_update_get)
router.post("/", bookController.book_create_post)
router.put("/update/:title", bookController.book_update_put)
router.delete("/delete/:id", bookController.book_delete)

module.exports = router;