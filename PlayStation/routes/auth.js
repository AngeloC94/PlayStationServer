const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
  console.log(req);
  try {
    const newUser = new User({
      email: req.body.formData.email,
      password: CryptoJS.AES.encrypt(
        req.body.formData.password,
        process.env.PASS_SEC
      ).toString(),

      firstName: req.body.formData.firstName,
      lastName: req.body.formData.lastName,
      userName: req.body.formData.userName,

      month: req.body.formData.month,
      day: req.body.formData.day,
      year: req.body.formData.year,

      stateProvince: req.body.formData.stateProvince,
      country: req.body.formData.country,
      city: req.body.formData.city,
      postalCode: req.body.formData.postalCode,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      email: req.body.email,
    });
    const hashedPassword = CryptoJS.AES.decrypt(
      user?.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword?.toString(CryptoJS.enc.Utf8);

    if (user && originalPassword === req.body.password) {
      const accessToken = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SEC,
        { expiresIn: "3d" }
      );
      const { password, ...others } = user._doc;

      const cryptoToken = CryptoJS.AES.encrypt(
        accessToken,
        process.env.PASS_SEC
      ).toString();

      res
        .status(200)
        .cookie("access-token", cryptoToken, {
          maxAge: 1000 * 60 * 60 * 24 * 3,
          httpOnly: true,
        })
        .json({ user: { ...others } });
    } else {
      res.status(401).json({ data: "Credenziali errate" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/logout", async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("access-token")
      .json({ message: "Logout Effettuato" });
    res.end();
  } catch (error) {}
});
module.exports = router;
