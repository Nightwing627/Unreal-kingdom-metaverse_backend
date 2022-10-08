//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables ---
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- define item schema  ---
const ItemSchema = new mongoose.Schema(
  {
    itemid: {
      type: Number,
      default: 0,
    },
    itemtype: {
      type: Number,
      default: 0,
    },
    specifictype: {
      type: Number,
    },
    equipmenttype: {
      type: Number,
      default: 0,
    },
    user: {
      type: String,
    },
    character: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// *** --- setup item model validator ---
ItemSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when item information required, retrieve item information in json ---
ItemSchema.methods.toItemJSON = function () {
  return {
    uid: this._id,
  };
};

// *** --- export item schema to use in controller ---
module.exports = mongoose.model("ItemSchema", ItemSchema);
