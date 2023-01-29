const router = require("express").Router();
const auth = require("../middleware/auth");
const Chat = require("../models/chat.model");
const Listing = require("../models/listing.model");

router.get("/buy-messages", auth, (req, res) => {
  const user = req.user;
  const userListings = [];

  Listing.find({ writer: user })
    .then((doc) => {
      doc.forEach((listing) => {
        userListings.push(listing._id);
      });

      Chat.find({
        $and: [
          { listing: { $nin: userListings } },
          { $or: [{ writer: user }, { receiver: user }] },
        ],
      })
        .populate("writer")
        .populate("receiver")
        .sort("+date")
        .exec((err, chatRes) => {
          if (err) return res.status(400).send(err);

          return res.status(200).send(chatRes);
        });
    })
    .catch((err) => console.error(err));
});

router.get("/sell-messages", auth, (req, res) => {
  const user = req.user;
  const userListings = [];

  Listing.find({ writer: user })
    .then((doc) => {
      doc.forEach((listing) => {
        userListings.push(listing._id);
      });

      Chat.find({
        $and: [
          { listing: { $in: userListings } },
          { $or: [{ writer: user }, { receiver: user }] },
        ],
      })
        .populate("writer")
        .populate("receiver")
        .sort("+date")
        .exec((err, chatRes) => {
          if (err) return res.status(400).send(err);

          return res.status(200).send(chatRes);
        });
    })
    .catch((err) => console.error(err));
});

module.exports = router;
