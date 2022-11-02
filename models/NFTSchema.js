//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables ---
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- define nft schema  ---
const NFTSchema = new mongoose.Schema(
  {
    nftAddress: {
      type: String,
      lowercase: true,
      required: true,
      default: "0x000000000000000000000000000000000000dEaD",
    },
    tokenId: { type: String, required: true },
    price: { type: String },
    marketFees: { type: String },
    name: { type: String },
    description: { type: String },
    tokenURI: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// *** --- setup nft model validator ---
NFTSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when NFT information required, retrieve NFT information in json ---
NFTSchema.methods.toNFTJSON = function () {
  return {
    uid: this._id,
    nftAddress: this.nftAddress,
    tokenId: this.tokenId,
    price: this.price,
    marketFees: this.marketFees,
    tokenURI: this.tokenURI,
    name: this.name,
    description: this.description,
  };
};

// *** --- export nft schema to use in controller ---
module.exports = mongoose.model("NFTSchema", NFTSchema);
