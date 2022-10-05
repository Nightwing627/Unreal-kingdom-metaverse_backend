//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- import router and database models
const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require('../middleware/auth');
const UserSchema = mongoose.model("UserSchema");
const CharacterSchema = mongoose.model("CharacterSchema");
const ObjectID = require('mongodb').ObjectId;
require("dotenv/config");

// *** --- add new character request ---
router.post("/addCharacter", async function (req, res, next) {
    const { userid, race, classe, gender } = req.body;

    // check if request body is empty or validated
    if (!userid || !race || !classe || !gender || !ObjectID.isValid(userid)) {
        return res.status(400).json({
            msg: "validation error",
        });
    }

    // retrieve user information by id
    const user = await UserSchema.findById(userid);

    // add new character if user is exisiting
    if (user) {
        const character = new CharacterSchema({ userid: userid, race: race, classe: classe, gender: gender });
        await character.save();

        return res.status(200).json({
            msg: "new character added",
        })
    } else {
        return res.status(403).json({
            msg: "user is not exisiting",
        });
    }
})

// *** --- delete existing character request ---
router.post("/deleteCharacter", async function (req, res, next) {
    const { characterid } = req.body;

    // check if request body is empty or validated
    if (!characterid || !ObjectID.isValid(characterid)) {
        return res.status(400).json({
            msg: "wrong character id",
        });
    }

    // retrieve character information by id
    const character = await CharacterSchema.findById(characterid);

    // delete character if it is existing
    if (character) {
        // find character by character id and remove from database
        await CharacterSchema.findByIdAndDelete(characterid);
        return res.status(200).json({
            msg: "character successfully removed",
        })
    } else {
        return res.status(403).json({
            msg: "character is not exisiting",
        });
    }
})

// *** --- fetch all character informations depends on user id ---
router.post("/getCharacters", async function (req, res, next) {
    const { userid } = req.body;

    // check if request body is empty or validated
    if (!userid || !ObjectID.isValid(userid)) {
        return res.status(400).json({
            msg: "wrong character id",
        });
    }

    // retrieve user information by id
    const user = await UserSchema.findById(userid);

    // get all characters belong to user if it is existing
    if (user) {
        // find all character informations belong to specific user id
        CharacterSchema.find({ userid: userid }).sort({
            createdAt: -1,
        }).then(function (characters) {
            let response = [];

            // map all items under user id
            characters.map((item) => {
                response.push({
                    race: item.race,
                    gender: item.gender,
                    classe: item.classe
                });
            })

            // retrieve characters by array format
            return res.status(200).json({
                msg: "retrieved character informations",
                characters: response,
            })
        }).catch(next);
    } else {
        return res.status(403).json({
            msg: "user is not exisiting",
        });
    }
})

// *** --- export user router ---
module.exports = router;