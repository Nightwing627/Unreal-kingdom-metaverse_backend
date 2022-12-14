//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- import router and database models
const mongoose = require("mongoose");
const router = require("express").Router();
const auth = require("../middleware/auth");
const UserSchema = mongoose.model("UserSchema");
const CharacterSchema = mongoose.model("CharacterSchema");
const ItemSchema = mongoose.model("ItemSchema");
const LandSchema = mongoose.model("LandSchema");
const ObjectID = require("mongodb").ObjectId;
require("dotenv/config");

// *** --- add new character request ---
router.post("/addCharacter", async function (req, res, next) {
  const { email, race, classe, gender } = req.body;

  // check if request body is empty or validated
  if (!email || !race || !classe || !gender) {
    return res.status(400).json({
      msg: "validation error",
    });
  }

  // retrieve user information by id
  const user = await UserSchema.findOne({ email: email });
  const length = await CharacterSchema.count();
  // add new character if user is exisiting
  if (user) {
    const character = new CharacterSchema({
      userid: user._id,
      race: race,
      classe: classe,
      gender: gender,
      cindex: length,
    });
    await character.save();

    return res.status(200).json({
      msg: "new character added",
    });
  } else {
    return res.status(403).json({
      msg: "user is not exisiting",
    });
  }
});

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
    refactorCharacters();
    return res.status(200).json({
      msg: "character successfully removed",
    });
  } else {
    return res.status(403).json({
      msg: "character is not exisiting",
    });
  }
});

// *** --- fetch all character informations depends on user id ---
router.post("/getCharacters", async function (req, res, next) {
  const { email } = req.body;

  refactorCharacters();

  // retrieve user information by id
  const user = await UserSchema.findOne({ email: email });

  // get all characters belong to user if it is existing
  if (user) {
    // find all character informations belong to specific user id
    CharacterSchema.find({ userid: user._id })
      .sort({
        createdAt: -1,
      })
      .then(function (characters) {
        let response = [];

        // map all items under user id
        characters.map((item) => {
          response.push({
            race: item.race,
            gender: item.gender,
            classe: item.classe,
            cindex: item.cindex,
          });
        });

        // retrieve characters by array format
        return res.status(200).json({
          msg: "retrieved character informations",
          characters: response,
        });
      })
      .catch(next);
  } else {
    return res.status(403).json({
      msg: "user is not exisiting",
    });
  }
});

/// *** --- get all characters request ---
router.post("/getAllCharacters", async function (req, res, next) {
  CharacterSchema.find()
    .then(function (characters) {
      let response = [];
      characters.map((item) => {
        response.push({
          uid: item._id,
          race: item.race,
          classe: item.classe,
          gender: item.gender,
          cindex: item.cindex,
          userid: item.userid,
        });
      });
      return res.status(200).json({
        msg: "retrieved all characters",
        characters: response,
      });
    })
    .catch(next);
});

// *** --- add new item request ---
router.post("/addItem", async function (req, res, next) {
  const { email, itemid, itemtype, specifictype, equipmenttype } = req.body;

  // check if request body is empty or validated
  if (!email) {
    return res.status(400).json({
      msg: "validation error",
    });
  }

  // retrieve user information by id
  const user = await UserSchema.findOne({ email: email });

  // add new item if user is exisiting
  if (user) {
    const item = new ItemSchema({
      itemid: itemid,
      user: email,
      itemtype: itemtype,
      specifictype: specifictype,
      equipmenttype: equipmenttype,
    });
    await item.save();

    return res.status(200).json({
      msg: "new item added",
    });
  } else {
    return res.status(403).json({
      msg: "user is not exisiting",
    });
  }
});

// *** --- delete existing item request ---
router.post("/deleteItem", async function (req, res, next) {
  const { itemid } = req.body;

  // check if request body is empty or validated
  if (!itemid || !ObjectID.isValid(itemid)) {
    return res.status(400).json({
      msg: "wrong item id",
    });
  }

  // retrieve item information by id
  const item = await ItemSchema.findById(itemid);

  // delete item if it is existing
  if (item) {
    // find item by item id and remove from database
    await ItemSchema.findByIdAndDelete(itemid);

    return res.status(200).json({
      msg: "item successfully removed",
    });
  } else {
    return res.status(403).json({
      msg: "item is not exisiting",
    });
  }
});

// *** --- fetch all item informations depends on user id ---
router.post("/getItems", async function (req, res, next) {
  const { email } = req.body;

  // retrieve user information by email
  const user = await UserSchema.findOne({ email: email });

  // get all items belong to user if it is existing
  if (user) {
    // find all item informations belong to specific user id
    ItemSchema.find({ user: user.email })
      .sort({
        createdAt: -1,
      })
      .then(function (items) {
        let response = [];

        // map all items under user id
        items.map((item) => {
          response.push({
            uid: item._id,
            itemid: item.itemid,
            itemtype: item.itemtype,
            specifictype: item.specifictype,
            equipmenttype: item.equipmenttype,
          });
        });

        // retrieve item by array format
        return res.status(200).json({
          msg: "retrieved item informations",
          items: response,
        });
      })
      .catch(next);
  } else {
    return res.status(403).json({
      msg: "user is not exisiting",
    });
  }
});

/// *** --- get all items request ---
router.post("/getAllItems", async function (req, res, next) {
  ItemSchema.find()
    .then(function (items) {
      let response = [];
      items.map((item) => {
        response.push({
          uid: item._id,
          itemid: item.itemid,
          itemtype: item.itemtype,
          equipmenttype: item.equipmenttype,
          specifictype: item.specifictype,
          user: item.user,
        });
      });
      return res.status(200).json({
        msg: "retrieved all characters",
        items: response,
      });
    })
    .catch(next);
});

// *** --- add new land request ---
router.post("/addLand", async function (req, res, next) {
  const { email, plots, size, landtype } = req.body;

  // check if request body is empty or validated
  if (!email) {
    return res.status(400).json({
      msg: "validation error",
    });
  }

  // retrieve user information by id
  const user = await UserSchema.findOne({ email: email });

  // add new land if user is exisiting
  if (user) {
    const land = new LandSchema({
      email: email,
      plots: plots,
      size: size,
      landtype: landtype,
    });
    await land.save();

    return res.status(200).json({
      msg: "new land added",
    });
  } else {
    return res.status(403).json({
      msg: "user is not exisiting",
    });
  }
});

// *** --- fetch all lands informations depends on user id ---
router.post("/getLands", async function (req, res, next) {
  const { email } = req.body;

  // retrieve user information by email
  const user = await UserSchema.findOne({ email: email });

  // get all lands belong to user if it is existing
  if (user) {
    // find all land informations belong to specific user id
    LandSchema.find({ email: user.email })
      .sort({
        createdAt: -1,
      })
      .then(function (items) {
        let response = [];

        // map all items under user id
        items.map((item) => {
          response.push({
            email: item.email,
            plots: item.plots,
            size: item.size,
            landtype: item.landtype,
          });
        });

        // retrieve item by array format
        return res.status(200).json({
          msg: "retrieved item informations",
          lands: response,
        });
      })
      .catch(next);
  } else {
    return res.status(403).json({
      msg: "user is not exisiting",
    });
  }
});

router.post("/refactorCharacters", async function (req, res, next) {
  refactorCharacters();
  return res.status(200).json({
    msg: "Refactor Items",
  });
});

const refactorCharacters = async () => {
  let counter = 0;
  await CharacterSchema.find()
    .sort({
      createdAt: -1,
    })
    .then(function (items) {
      // map all items
      items.map((item) => {
        item.cindex = counter;
        item.save();
        counter++;
      });
    })
    .catch();
};

// *** --- export user router ---
module.exports = router;