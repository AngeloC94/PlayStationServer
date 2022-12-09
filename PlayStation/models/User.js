const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, min: 8, max: 16 },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    userName: { type: String, required: true, unique: true },

    month: { type: String, required: true },
    day: { type: Number, required: true },
    year: { type: Number, required: true },

    stateProvince: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    postalCode: { type: Number, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
