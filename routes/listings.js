/* eslint-disable consistent-return */
const router = require("express").Router();
const multer = require("multer");
const fs = require("fs");
const auth = require("../middleware/auth");
const Listing = require("../models/listing.model");
const { isNullable, isDefined } = require("../utils/null-check");

const storage = multer.diskStorage({
  destination: (cb) => {
    cb(null, `${__dirname}/../uploads/`);
  },
  filename: (file, cb) => {
    cb(
      null,
      `${Date.now()}-${file.originalname.toLowerCase().split(" ").join("-")}`
    );
  },
});

const upload = multer({
  storage,
  // eslint-disable-next-line consistent-return
  fileFilter: (file, cb) => {
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

router.post("/", (request, result) => {
  const location = isNullable(request.body.location)
    ? undefined
    : parseInt(request.body.location, 10);

  const category = isNullable(request.body.category)
    ? undefined
    : parseInt(request.body.category, 10);

  const findArgs = {};

  if (location !== undefined) {
    findArgs.location = location;
  }

  if (category !== undefined) {
    findArgs.category = category;
  }

  if (request.body.text) {
    const regex = new RegExp(request.body.text, "i");
    findArgs.desc = { $regex: regex };
  }

  Listing.find(findArgs)
    .populate("writer")
    .sort("-date")
    .then((listings) => result.json(listings))
    .catch((error) => result.status(400).json(`Error: ${error}`));
});

router.get("/listings-by-user", (request, result) => {
  const _id = request.query.id;

  Listing.find({ writer: { $in: _id } })
    .populate("writer")
    .sort("-date")
    .exec((error, listing) => {
      if (error) return result.status(400).send(error);
      return result.status(200).send(listing);
    });
});

router.get("/listings-by-id", (request, result) => {
  const type = request.query.type;
  let id;

  if (type === "array") {
    id = request.query.id.split(",");
  } else {
    id = request.query.id;
  }

  Listing.find({ _id: { $in: id } })
    .populate("writer")
    .sort("-date")
    .exec((error, listing) => {
      if (error) return result.status(400).send(error);
      return result.status(200).send(listing);
    });
});

router.post("/add/images", upload.array("images", 6), (request, result) => {
  if (request.files === null) {
    return result.status(400).json({ message: "Neįkeltas failas" });
  }

  const uploads = [];

  for (let i = 0; i < request.files.length; i += 1) {
    uploads.push({
      fileName: request.files[i].filename,
      filePath: `uploads/${request.files[i].filename}`,
    });
  }

  Listing.findByIdAndUpdate(request.header("listing-id"), {
    image: uploads,
  })
    .then(() => result.json("Nuotraukos įrašytos"))
    .catch((error) => result.status(500).json({ error: error.message }));

  return undefined;
});

router.post("/add", auth, (request, result) => {
  const writer = request.body.writer;
  const title = request.body.title;
  const date = Date.parse(request.body.date);
  const condition = request.body.condition;
  const category = request.body.category;
  const desc = request.body.desc;
  const location = request.body.location;

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
    .then((doc) => result.json({ id: doc._id }))
    .catch((error) => result.status(400).json(error));
});

router.get("/:id", (request, result) => {
  Listing.findById(request.params.id)
    .then((listing) => result.json(listing))
    .catch((error) => result.status(400).json(`Error: ${error}`));
});

router.delete("/:id", (request, result) => {
  Listing.findById(request.params.id)
    .then((listingRes) => {
      const images = listingRes.image;

      Listing.findByIdAndDelete(request.params.id)
        .then(() => {
          images.forEach(async (image) => {
            try {
              fs.unlinkSync(`${__dirname}/../${image.filePath}`);
            } catch (error) {
              console.error(new Error(error));
            }
          });

          result.json("Skelbimas ištrintas.");
        })
        .catch((error) => result.status(500).json(`Error: ${error}`));
    })
    .catch((error) => result.status(500).json(`Error: ${error}`));
});

router.post("/update-images", upload.array("images", 6), (request, result) => {
  if (request.files === null) {
    return result.status(400).json({ message: "Failas neįkeltas" });
  }

  const id = request.query.id;
  const order = request.query.order.split(",").map((o) => parseInt(o, 10));
  const filenames = request.query.filenames.split(",");

  const uploads = [];

  for (let i = 0; i < request.files.length; i += 1) {
    uploads.push({
      fileName: request.files[i].filename,
      filePath: `uploads/${request.files[i].filename}`,
    });
  }

  Listing.findById(id)
    .then((listing) => {
      const shouldDel = [];

      listing.image.forEach((image) => {
        const found = filenames.find((fname) => fname === image.fileName);

        if (isNullable(found)) shouldDel.push(image);
      });

      shouldDel.forEach(async (file) => {
        try {
          fs.unlinkSync(`${__dirname}/../${file.filePath}`);
        } catch (error) {
          console.error(new Error(error));
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
        .then(() => result.json("Skelbimas atnaujintas!"))
        .catch((error) => result.status(500).json(`Error: ${error}`));
    })
    .catch((error) => {
      result.status(500).json(`Error: ${error}`);
    });
});

router.post("/update/:id", auth, (request, result) => {
  const shouldDelete = [];

  Listing.findById(request.params.id).then((listing) => {
    listing.title = request.body.title;
    listing.location = request.body.location;
    listing.category = request.body.category;
    listing.condition = request.body.condition;
    listing.desc = request.body.desc;

    if (
      listing.image.length !== request.body.files.length &&
      isDefined(request.body.files)
    ) {
      listing.image.forEach((image) => {
        const fileFound = request.body.files.find(
          (file) => file.fileName === image.fileName
        );
        if (isNullable(fileFound)) shouldDelete.push(image);
      });

      shouldDelete.forEach(async (file) => {
        try {
          fs.unlinkSync(`${__dirname}/../${file.filePath}`);
        } catch (error) {
          console.error(new Error(error));
        }
      });
    }

    listing.image = isNullable(request.body.files)
      ? listing.image
      : request.body.files;

    listing
      .save()
      .then(() => result.json("Skelbimas atnaujintas."))
      .catch((error) => console.error(new Error(error)));
  });
});

module.exports = router;
