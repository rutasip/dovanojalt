/* eslint-disable node/prefer-promises/fs */
/* eslint-disable consistent-return */
const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const auth = require("../middleware/auth");
const Listing = require("../models/listing.model");
const { isNullable, isDefined } = require("../utils/null-check");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${__dirname}/../uploads/`);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname.toLowerCase().split(" ").join("-")}`
    );
  },
});

const upload = multer({
  storage,
  // eslint-disable-next-line consistent-return
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Galima įkelti tik .png, .jpg ir .jpeg formato nuotraukas."));
    }
  },
});

router.post("/", (req, res) => {
  const location = isNullable(req.body.location)
    ? undefined
    : parseInt(req.body.location, 10);

  const category = isNullable(req.body.category)
    ? undefined
    : parseInt(req.body.category, 10);

  const findArgs = {};

  if (location !== undefined) {
    findArgs.location = location;
  }

  if (category !== undefined) {
    findArgs.category = category;
  }

  if (req.body.text) {
    const regex = new RegExp(req.body.text, "i");
    findArgs.desc = { $regex: regex };
  }

  Listing.find(findArgs)
    .populate("writer")
    .sort("-date")
    .then((listings) => res.json(listings))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.get("/listings-by-user", (req, res) => {
  const _id = req.query.id;

  Listing.find({ writer: { $in: _id } })
    .populate("writer")
    .sort("-date")
    .then((listing) => res.status(200).send(listing)).catch((err) => res.status(400).send(err));
});

router.get("/listings-by-id", (req, res) => {
  const type = req.query.type;
  let id;

  if (type === "array") {
    id = req.query.id.split(",");
  } else {
    id = req.query.id;
  }

  Listing.find({ _id: { $in: id } })
    .populate("writer")
    .sort("-date")
    .then((listing) => res.status(200).send(listing)).catch((err) => res.status(400).send(err));
});

router.post("/add/images", upload.array("images", 6), (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "Neįkeltas failas" });
  }

  const uploads = [];

  for (let i = 0; i < req.files.length; i += 1) {
    uploads.push({
      fileName: req.files[i].filename,
      filePath: `uploads/${req.files[i].filename}`,
    });
  }

  Listing.findByIdAndUpdate(req.header("listing-id"), {
    image: uploads,
  })
    .then(() => res.json("Nuotraukos įrašytos"))
    .catch((err) => res.status(500).json({ error: err.message }));

  return undefined;
});

router.post("/add", auth, (req, res) => {
  const writer = req.body.writer;
  const title = req.body.title;
  const date = Date.parse(req.body.date);
  const condition = req.body.condition;
  const category = req.body.category;
  const desc = req.body.desc;
  const location = req.body.location;

  const newListing = new Listing({
    writer,
    title,
    date,
    condition,
    category,
    desc,
    location,
  });

  newListing
    .save()
    .then((doc) => res.json({ id: doc._id }))
    .catch((err) => res.status(400).json(err));
});

router.get("/:id", (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => res.json(listing))
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

router.delete("/:id", (req, res) => {
  Listing.findById(req.params.id)
    .then((listingRes) => {
      const images = listingRes.image;

      Listing.findByIdAndDelete(req.params.id)
        .then(() => {
          images.forEach(async (img) => {
            try {
              fs.unlinkSync(`${__dirname}/../${img.filePath}`);
            } catch (err) {
              console.error(err);
            }
          });

          res.json("Skelbimas ištrintas.");
        })
        .catch((err) => res.status(500).json(`Error: ${err}`));
    })
    .catch((err) => res.status(500).json(`Error: ${err}`));
});

router.post("/update-images", upload.array("images", 6), (req, res) => {
  if (req.files === null) {
    return res.status(400).json({ msg: "Failas neįkeltas" });
  }

  const id = req.query.id;
  const order = req.query.order.split(",").map((o) => parseInt(o, 10));
  const filenames = req.query.filenames.split(",");

  const uploads = [];

  for (let i = 0; i < req.files.length; i += 1) {
    uploads.push({
      fileName: req.files[i].filename,
      filePath: `uploads/${req.files[i].filename}`,
    });
  }

  Listing.findById(id)
    .then((listing) => {
      const shouldDel = [];

      listing.image.forEach((img) => {
        const found = filenames.find((fname) => fname === img.fileName);

        if (isNullable(found)) shouldDel.push(img);
      });

      shouldDel.forEach(async (file) => {
        try {
          fs.unlinkSync(`${__dirname}/../${file.filePath}`);
        } catch (err) {
          console.error(err);
        }
      });

      const images = [];

      order.forEach((o) => {
        if (o === 1) {
          images.push(uploads.pop());
        } else {
          const file = filenames.pop();
          images.push({
            fileName: file,
            filePath: `uploads/${file}`,
          });
        }
      });

      listing.image = images;

      listing
        .save()
        .then(() => res.json("Skelbimas atnaujintas."))
        .catch((err) => res.status(500).json(`Error: ${err}`));
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json(`Error: ${err}`);
    });
});

router.post("/update/:id", auth, (req, res) => {
  Listing.findById(req.params.id)
    .then((listing) => {
      listing.title = req.body.title;
      listing.location = req.body.location;
      listing.category = req.body.category;
      listing.desc = req.body.desc;
      listing.condition = req.body.condition;

      if (
        isDefined(req.body.files) &&
        listing.image.length !== req.body.files.length
      ) {
        const shouldDel = [];

        listing.image.forEach((img) => {
          const found = req.body.files.find(
            (file) => file.fileName === img.fileName
          );
          if (isNullable(found)) shouldDel.push(img);
        });

        shouldDel.forEach(async (file) => {
          try {
            fs.unlinkSync(`${__dirname}/../${file.filePath}`);
          } catch (err) {
            console.error(err);
          }
        });
      }

      listing.image = isDefined(req.body.files)
        ? req.body.files
        : listing.image;

      listing
        .save()
        .then(() => res.json("Skelbimas atnaujintas."))
        .catch((err) => res.status(400).json(`Error: ${err}`));
    })
    .catch((err) => res.status(400).json(`Error: ${err}`));
});

module.exports = router;
