//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables --- 
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
require("dotenv/config");

// *** --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 
// *** --- Define wallet schema to manage multiple wallets later ---
// *** --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- --- 

// *** --- define wallet schema  --- 
const WalletSchema = new mongoose.Schema(
    {
        userid: {
            type: String
        },
        wallet: {
            type: String,
            lowercase: true,
            required: true,
            default: "0x000000000000000000000000000000000000dEaD"
        }

        // need to make sure if we add signature later
    },
    {
        timestamps: true,
    }
);

// *** --- setup wallet model validator ---
WalletSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when wallet information required, retrieve wallet information in json ---
WalletSchema.methods.toWalletJSON = function () {
    return {
        uid: this._id,
        userid: this.userid,
        wallet: this.wallet,
    };
};

// *** --- export wallet schema to use in controller ---
module.exports = mongoose.model('WalletSchema', WalletSchema);
