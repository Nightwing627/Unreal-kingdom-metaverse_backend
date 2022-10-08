//********** Authored by: Alex *********//
//********** Date: October, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables ---
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- define wallet schema  ---
const LandSchema = new mongoose.Schema(
  {
    wallet: {
      type: String,
      lowercase: true,
      required: true,
      default: "0x000000000000000000000000000000000000dEaD",
    },
    email: {
      type: String,
    },
    plots: {
      type: Number,
    },
    size: {
      type: Number,
    },
    landtype: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// *** --- setup land model validator ---
LandSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when land information required, retrieve land information in json ---
LandSchema.methods.toLandJSON = function () {
  return {
    uid: this._id,
  };
};

// *** --- export land schema to use in controller ---
module.exports = mongoose.model("LandSchema", LandSchema);
