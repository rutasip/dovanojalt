/* eslint-disable consistent-return */
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const auth = require("../middleware/auth");
const User = require("../models/user.model");
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
  fileFilter: (file, cb) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error("Galima įkelti tik .png, .jpg ir .jpeg formato nuotraukas.")
      );
    }
  },
});

router.post("/add-to-favorites", auth, (request, result) => {
  const id = request.body.id;

  User.findOne({ _id: request.user, favorites: id })
    .then((findRes) => {
      const exists = isDefined(findRes);

      if (exists === true) {
        User.findByIdAndUpdate(request.user, {
          $pull: { favorites: id },
        })
          .then(() => result.json({ message: "Ištrinta iš įsimintų skelbimų" }))
          .catch((error) => result.status(500).json({ error: error.message }));
      } else {
        User.findByIdAndUpdate(request.user, {
          $push: { favorites: id },
        })
          .then(() => result.json({ message: "Pridėta prie įsimintų skelbimų" }))
          .catch((error) => result.status(500).json({ error: error.message }));
      }
    })
    .catch((error) => result.status(500).json({ error: error.message }));
});

router.post("/upload-image", auth, upload.single("file"), (request, result) => {
  if (request.file === null) {
    return result.status(400).json({ message: "Failas neįkeltas" });
  }

  User.findByIdAndUpdate(request.user, {
    image: {
      fileName: request.file.filename,
      filePath: `uploads/${request.file.filename}`,
    },
  })
    .then(() => result.json("Paskyros nuotrauka atnaujinta"))
    .catch((err) => result.status(500).json({ error: err.message }));

  return undefined;
});

router.post("/change-info", auth, async (request, result) => {
  const { username, email, location, password } = request.body;

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  User.findOne({
    $and: [{ _id: { $ne: request.user } }, { $or: [{ username }, { email }] }],
  })
    .then((userRes) => {
      if (isNullable(userRes)) {
        User.findByIdAndUpdate(request.user, {
          username,
          email,
          location,
          password: passwordHash,
        })
          .then(() => result.json("Informacija atnaujinta"))
          .catch((error) => result.status(500).json({ error: error.message }));
      } else {
        return result
          .status(400)
          .json({ message: "Slapyvardis arba el. paštas jau naudojamas" });
      }
    })
    .catch((error) => {
      console.error(new Error(error));
      return result.status(400).send(error);
    });
});

router.get("/find-by-username", (request, result) => {
  const user = request.query.username;

  User.find({ username: user })
    .then((userRes) => {
      result.json(userRes);
    })
    .catch((error) => {
      result.status(400).send(error);
    });
});

router.get("/user", auth, async (request, result) => {
  const user = await User.findById(request.user);

  result.json({
    username: user.username,
    email: user.email,
    id: user._id,
    image: user.image,
    createdAt: user.createdAt,
    location: user.location,
    favorites: user.favorites,
  });
});

router.post("/register", async (request, result) => {
  try {
    const { email, username, location, password, passwordCheck } = request.body;

    if (
      isNullable(email) ||
      isNullable(username) ||
      isNullable(location) ||
      isNullable(password) ||
      isNullable(passwordCheck)
    ) {
      return result
        .status(400)
        .json({ message: "Užpildykite visus laukelius" });
    }

    if (username.length < 4)
      return result
        .status(400)
        .json({ message: "Slapyvardis turi susidaryti bent iš 4 simbolių" });

    if (password.length < 8)
      return result
        .status(400)
        .json({ message: "Slaptažodis turi susidaryti bent iš 8 simbolių" });

    if (password !== passwordCheck)
      return result.status(400).json({ message: "Slaptažodžiai nesutampa" });

    const emailExists = await User.findOne({ email });

    if (emailExists)
      return result
        .status(400)
        .json({ message: "Naudotojas su tokiu el. paštu jau egzistuoja" });

    const usernameExists = await User.findOne({ username });

    if (usernameExists)
      return result
        .status(400)
        .json({ message: "Naudotojas su tokiu slapyvardžiu jau egzistuoja" });

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const createUser = new User({
      email,
      password: passwordHash,
      username,
      location,
    });

    const createdUser = await createUser.save();

    return result.json(createdUser);
  } catch (error) {
    return result.status(500).json({ error: error.message });
  }
});

router.post("/prisijungti", async (request, result) => {
  try {
    const { email, password } = request.body;

    if (!email || !password) {
      return result
        .status(400)
        .json({ message: "Įrašykite el. paštą ir slaptažodį" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return result
        .status(400)
        .json({ message: "Neteisingas el. paštas arba slaptažodis" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return result.status(400).json({ message: "Neteisingi duomenys" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return result.json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        image: user.image,
        location: user.location,
        favorites: user.favorites,
      },
    });
  } catch (err) {
    return result.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, (request, result) => {
  User.findByIdAndDelete(request.user)
    .then((deletedUser) => result.json(deletedUser))
    .catch((err) => result.status(500).json({ error: err.message }));
});

router.post("/token-is-valid", (request, result) => {
  const token = request.header("x-auth-token");
  if (!token) return result.json(false);

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  if (!verified) return result.json(false);

  User.findById(verified.id)
    .then((userRes) => {
      if (isNullable(userRes)) {
        return result.json(false);
      }

      return result.json(true);
    })
    .catch((error) => result.status(500).json({ error: error.message }));
});

module.exports = router;
