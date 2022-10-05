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
        id: {
            type: Number,
            default: 0,
        },
        minstatus: {
            type: Number,
            default: 0,
        },
        name: {
            type: String,
        },
        aagi: {
            type: Number,
            default: 0,
        },
        ac: {
            type: Number,
            default: 0,
        },
        accuracy: {
            type: Number,
            default: 0,
        },
        acha: {
            type: Number,
            default: 0,
        },
        adex: {
            type: Number,
            default: 0,
        },
        aint: {
            type: Number,
            default: 0,
        },
        artifactflag: {
            type: Number,
            default: 0,
        },
        asta: {
            type: Number,
            default: 0,
        },
        astr: {
            type: Number,
            default: 0,
        },
        attack: {
            type: Number,
            default: 0,
        },
        augrestrict: {
            type: Number,
            default: 0,
        },
        augslot1type: {
            type: Number,
            default: 0,
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
module.exports = mongoose.model('ItemSchema', ItemSchema);