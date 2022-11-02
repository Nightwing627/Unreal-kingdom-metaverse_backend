//********** Authored by: Alex *********//
//********** Date: October, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables ---
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- define whitelist schema  ---
const WhitelistSchema = new mongoose.Schema(
  {
    email: {
      type: String,
    },
    wallet: {
      type: String,
      lowercase: true,
      required: true,
      default: "0x000000000000000000000000000000000000dEaD",
    },
  },
  {
    timestamps: true,
  }
);

// *** --- setup whitelist model validator ---
WhitelistSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when whitelist information required, retrieve wallet information in json ---
WhitelistSchema.methods.toWhitelistJSON = function () {
  return {
    uid: this._id,
    email: this.email,
    wallet: this.wallet,
  };
};

// *** --- export whitelist schema to use in controller ---
module.exports = mongoose.model("WhitelistSchema", WhitelistSchema);
