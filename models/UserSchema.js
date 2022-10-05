//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- initialize variables --- 
const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require('crypto');
const jwt = require("jsonwebtoken");
require("dotenv/config");

// *** --- define user schema  --- 
const UserSchema = new mongoose.Schema(
    {
        name: { type: String },
        email: {
            type: String,
            lowercase: true,
            unique: true,
            required: [true, "can't be blank"],
            match: [/\S+@\S+\.\S+/, "is invalid"],
            index: true,
        },
        salt: { type: String },
        hash: { type: String },
        lastlogindate: {
            type: Date, default: Date.now
        },
        lastloginip: { type: String, default: "0.0.0.0" }
    },
    {
        timestamps: true,
    }
);

// *** --- setup user model validator  ---
UserSchema.plugin(uniqueValidator, { message: "is already taken" });

// *** --- authenticate related functions  ---
// *** --- generate json web tokens for auth control ---
UserSchema.methods.generateJWT = function () {
    const today = new Date();
    const exp = new Date(today);

    // set expire date as 1 day for now (placeholder)
    exp.setDate(today.getDate() + 1);
    return jwt.sign(
        {
            id: this._id,
            name: this.name,
            expt: parseInt(exp.getTime() / 1000),
        },
        process.env.SECRET
    );
};

// *** --- password validation ---
UserSchema.methods.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
    return this.hash === hash;
};

// *** --- store password ---
UserSchema.methods.setPassword = function (password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

// *** --- response function when auth information required, retrieve user information in json ---
UserSchema.methods.toAuthJSON = function () {
    return {
        uid: this._id,
        name: this.name,
        email: this.email,
        createdate: this.createdate,
        lastlogindate: this.lastlogindate,
        lastloginip: this.lastloginip,
        token: this.generateJWT(),
    };
};

// *** --- export user schema to use in controller ---
module.exports = mongoose.model('UserSchema', UserSchema);
