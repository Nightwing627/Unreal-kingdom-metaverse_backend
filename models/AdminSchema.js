//********** Authored by: Alex *********//
//********** Date: October, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables ---
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- define wallet schema  ---
const AdminSchema = new mongoose.Schema(
  {
    downloadURL: {
      type: String,
    },
    privillege: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true,
  }
);

// *** --- setup admin model validator ---
AdminSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when admin information required, retrieve admin information in json ---
AdminSchema.methods.toAdminJSON = function () {
  return {
    uid: this._id,
    downloadURL: this.downloadURL,
  };
};

// *** --- export admin schema to use in controller ---
module.exports = mongoose.model("AdminSchema", AdminSchema);
