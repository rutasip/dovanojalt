/* eslint-disable consistent-return */
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const fs = require("fs");
const auth = require("../middleware/auth");
const User = require("../models/user.model");
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
  fileFilter: (req, file, cb) => {
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

router.post("/add-to-favorites", auth, (req, res) => {
  const id = req.body.id;

  User.findOne({ _id: req.user, favorites: id })
    .then((findRes) => {
      const exists = isDefined(findRes);

      if (exists === true) {
        User.findByIdAndUpdate(req.user, {
          $pull: { favorites: id },
        })
          .then(() => res.json({ msg: "Ištrinta iš įsimintų skelbimų" }))
          .catch((err) => res.status(500).json({ error: err.message }));
      } else {
        User.findByIdAndUpdate(req.user, {
          $push: { favorites: id },
        })
          .then(() => res.json({ msg: "Pridėta prie įsimintų skelbimų" }))
          .catch((err) => res.status(500).json({ error: err.message }));
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/upload-image", auth, upload.single("file"), (req, res) => {
  if (req.file === null) {
    return res.status(400).json({ msg: "Failas neįkeltas" });
  }

  User.findByIdAndUpdate(req.user, {
    image: {
      fileName: req.file.filename,
      filePath: `uploads/${req.file.filename}`,
    },
  })
    .then(() => res.json("Paskyros nuotrauka atnaujinta"))
    .catch((err) => res.status(500).json({ error: err.message }));

  return undefined;
});

router.post("/change-info", auth, async (req, res) => {
  const { username, email, location, password } = req.body;

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  User.findOne({
    $and: [{ _id: { $ne: req.user } }, { $or: [{ username }, { email }] }],
  })
    .then((userRes) => {
      if (isNullable(userRes)) {
        User.findByIdAndUpdate(req.user, {
          username,
          email,
          location,
          password: passwordHash,
        })
          .then(() => res.json("Informacija atnaujinta"))
          .catch((err) => res.status(500).json({ error: err.message }));
      } else {
        return res
          .status(400)
          .json({ msg: "Slapyvardis arba el. paštas jau naudojamas" });
      }
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).send(err);
    });
});

router.get("/find-by-username", (req, res) => {
  const user = req.query.username;

  User.find({ username: user })
    .then((userRes) => {
      res.json(userRes);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
});

router.get("/user", auth, async (req, res) => {
  const user = await User.findById(req.user);

  res.json({
    username: user.username,
    email: user.email,
    id: user._id,
    image: user.image,
    createdAt: user.createdAt,
    location: user.location,
    favorites: user.favorites,
  });
});

router.post("/register", async (req, res) => {
  try {
    const { email, password, passwordCheck, username, location } = req.body;

    if (
      isNullable(email) ||
      isNullable(password) ||
      isNullable(passwordCheck) ||
      isNullable(username)
    ) {
      return res.status(400).json({ msg: "Užpildykite visus laukelius" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ msg: "Slaptažodis turi susidaryti bent iš 8 simbolių" });
    }

    if (password !== passwordCheck) {
      return res.status(400).json({ msg: "Slaptažodžiai nesutampa" });
    }

    if (username.length < 4) {
      return res
        .status(400)
        .json({ msg: "Slapyvardis turi susidaryti bent iš 4 simbolių" });
    }

    if (isNullable(location)) {
      return res.status(400).json({ msg: "Pasirinkite miestą" });
    }

    const emailExists = await User.findOne({ email });

    if (emailExists) {
      return res
        .status(400)
        .json({ msg: "Naudotojas su tokiu el. paštu jau egzistuoja" });
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res
        .status(400)
        .json({ msg: "Naudotojas su tokiu slapyvardžiu jau egzistuoja" });
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      email,
      password: passwordHash,
      username,
      location,
    });

    const savedUser = await newUser.save();
    return res.json(savedUser);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

router.post("/prisijungti", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ msg: "Įrašykite el. paštą ir slaptažodį" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ msg: "Neteisingas el. paštas arba slaptažodis" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Neteisingi duomenys" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    return res.json({
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
    return res.status(500).json({ error: err.message });
  }
});

router.delete("/delete", auth, (req, res) => {
  User.findByIdAndDelete(req.user)
    .then((deletedUser) => {
      if (deletedUser.image.fileName !== "avatar_placeholder.png") {
        fs.unlinkSync(`${__dirname}/../${deletedUser.image.filePath}`);
        return res.json(deletedUser);
      }
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

router.post("/token-is-valid", (req, res) => {
  const token = req.header("x-auth-token");

  if (!token) return res.json(false);

  const verified = jwt.verify(token, process.env.JWT_SECRET);
  
  if (!verified) return res.json(false);

  User.findById(verified.id)
    .then((userRes) => {
      if (isNullable(userRes)) {
        return res.json(false);
      }

      return res.json(true);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
});

module.exports = router;
