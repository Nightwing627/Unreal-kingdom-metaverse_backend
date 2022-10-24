//********** Authored by: Guru18650 *********//
//********** Date: October, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables ---
const mongoose = require("mongoose");

// *** --- define ads schema  ---
const AdsSchema = new mongoose.Schema(
  {
    buildingid: {
      type: Number,
      default: 0,
    },
    floor: {
      type: Number,
      default: 0,
    },
    texture: {
      type: String,
    },
    owner: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// *** --- response function when ad info required, retrieve ad in json ---
AdsSchema.methods.toAdJSON = function () {
  return {
    uid: this._id,
    buildingid: this.buildingid,
    floor: this.floor,
    texture: this.texture,
    owner: this.owner,
  };
};

// *** --- export ads info schema to use in controller ---
module.exports = mongoose.model("AdsSchema", AdsSchema);
