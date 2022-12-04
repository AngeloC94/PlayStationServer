const User = require("../models/User");
const CryptoJS = require('crypto-js')
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();



//Get User from ID
router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        const { password, ...others } = user._doc
        res.status(200).json(others)
    } catch (error) {
        res.status(500).json(error)
    }
})





module.exports = router