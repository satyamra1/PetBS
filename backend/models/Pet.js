const mongoose = require("mongoose")

const petSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    enum: ["dog", "cat", "bird", "fish", "other"],
  },
  weight: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

const Pet = mongoose.model("Pet", petSchema)

module.exports = Pet
