const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 4,
    },
    location: {
      type: Number,
      required: true,
    },
    image: {
      fileName: {
        type: String,
        default: "avatar_placeholder.png",
        required: true,
      },
      filePath: {
        type: String,
        default: "uploads/avatar_placeholder.png",
        required: true,
      },
    },
    favorites: {
      type: Array,
      default: [],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
