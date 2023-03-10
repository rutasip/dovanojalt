const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const listingSchema = new Schema(
  {
    writer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    image: { type: Array, default: [], required: false },
    desc: { type: String, required: false },
    condition: { type: String, required: true },
    location: { type: Number, required: true },
    category: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;
