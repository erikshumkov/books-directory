const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const imageSchema = new Schema({
  image: {
    type: String,
    data: Buffer
  }
})

const Image = mongoose.model("image", imageSchema)

module.exports = Image

