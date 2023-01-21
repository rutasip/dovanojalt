const router = require("express").Router();
const auth = require("../middleware/auth");
const Chat = require("../models/chat.model");
const Listing = require("../models/listing.model");

router.get("/buy-messages", auth, (request, result) => {
  const user = request.user;
  const userListings = [];

  Listing.find({ writer: user })
    .then((list) => {
      list.map((listing) => userListings.push(listing._id));

      Chat.find({
        $and: [
          { listing: { $nin: userListings } },
          { $or: [{ receiver: user }, { writer: user }] },
        ],
      })
        .populate("writer")
        .populate("receiver")
        .sort("+date")
        .exec((error, chatResult) => {
          if (error) return result.status(400).send(error);

          return result.status(200).send(chatResult);
        });
    })
    .catch((error) => console.error(new Error(error)));
});

router.get("/sell-messages", auth, (request, result) => {
  const user = request.user;
  const userListings = [];

  Listing.find({ writer: user })
    .then((list) => {
      list.map((listing) => userListings.push(listing._id));

      Chat.find({
        $and: [
          { listing: { $in: userListings } },
          { $or: [{ receiver: user }, { writer: user }] },
        ],
      })
        .populate("writer")
        .populate("receiver")
        .sort("+date")
        .exec((error, chatResult) => {
          if (error) return result.status(400).send(error);

          return result.status(200).send(chatResult);
        });
    })
    .catch((error) => console.error(new Error(error)));
});

module.exports = router;
