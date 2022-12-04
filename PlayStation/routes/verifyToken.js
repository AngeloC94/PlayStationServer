const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");

//Verify Token
const verifyToken = (req, res, next) => {
  const token = req.cookies["access-token"];
  try {
    const hashedToken = CryptoJS.AES.decrypt(
      token,
      process.env.PASS_SEC
    );
    const originalToken = hashedToken?.toString(CryptoJS.enc.Utf8);

    if (originalToken) {
      jwt.verify(originalToken, process.env.JWT_SEC, (err, user) => {
        if (err) res.status(403).json({ message: "Token non valido" });
        req.user = user;
        next();
      });
    } else {
      return res.status(500).json({ message: "Non sei autenticato" });
    }
  } catch (error) {
    res.status(403).json({ message: "Token non valido" })
  }

};

//Verify Token and Authorization (My Profile or isAdmin)
const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Non sei autorizzato a fare questo");
    }
  });
};

//Verify Token and Authorization (isAdmin)
const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      res.status(403).json("Non sei autorizzato a fare questo");
    }
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
};
