//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables --- 
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
// *** --- NFT Schema : Designed to store multiple NFTs for project ---
// *** --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

// *** --- define nft schema  --- 
const NFTSchema = new mongoose.Schema(
    {
        token_address: {
            type: String,
            lowercase: true,
            required: true,
            default: "0x000000000000000000000000000000000000dEaD"
        },
        token_id: { type: String, required: true },
        amount: { type: Number },
        owner_of: {
            type: String, lowercase: true,
            required: true,
            default: "0x000000000000000000000000000000000000dEaD"
        },
        token_hash: { type: String, required: true },
        contract_type: { type: String, required: true },
        name: { type: String, required: true },
        symbol: { type: String, required: true },
        token_uri: { type: String, required: true },
        admin: { type: Boolean, default: true },
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
        token_address: this.token_address,
        token_id: this.token_id,
        amount: this.amount,
        owner_of: this.owner_of,
        token_hash: this.token_hash,
        contract_type: this.contract_type,
        name: this.name,
        symbol: this.symbol,
        token_uri: this.token_uri,
        admin: this.admin,
    };
};

// *** --- export nft schema to use in controller ---
module.exports = mongoose.model('NFTSchema', NFTSchema);
