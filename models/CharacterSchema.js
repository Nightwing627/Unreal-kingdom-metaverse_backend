//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables --- 
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// *** --- define character schema  --- 
const CharacterSchema = new mongoose.Schema(
    {
        userid: {
            type: String
        },
        race: {
            type: Number,
            default: 0,
        },
        gender: {
            type: Number,
            default: 0,
        },
        classe: {
            type: Number,
            default: 0,
        },

        // maybe a few more in the later
    },
    {
        timestamps: true,
    }
);

// *** --- setup user info model validator  ---
CharacterSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- response function when user info required, retrieve user type in json ---
CharacterSchema.methods.toCharacterJSON = function () {
    return {
        uid: this._id,
        userid: this.userid,
        race: this.race,
        class: this.class,
        gender: this.gender,
    };
};

// *** --- export user info schema to use in controller ---
module.exports = mongoose.model('CharacterSchema', CharacterSchema);
