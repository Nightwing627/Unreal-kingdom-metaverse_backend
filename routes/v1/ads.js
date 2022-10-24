//********** Authored by: Guru18650 *********//
//********** Date: October, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- import router and database models
const mongoose = require("mongoose");
const router = require("express").Router();
const AdsSchema = mongoose.model("AdsSchema");
const ObjectID = require("mongodb").ObjectId;
require("dotenv/config");

// *** --- add new ad request ---
router.post("/addAd", async function (req, res, next) {
  const { buildingid, floor, texture, owner } = req.body;

  // check if request body is empty or validated
  if (!buildingid || !floor || !texture || !owner) {
    return res.status(400).json({
      msg: "validation error",
    });
  }

  const ad = new AdsSchema({
    buildingid: buildingid,
    floor: floor,
    texture: texture,
    owner: owner,
  });
  await ad.save();

  return res.status(200).json({
    msg: "new ad added",
  });
});

// *** --- delete existing ad request ---
router.post("/deleteAd", async function (req, res, next) {
  const { adId } = req.body;

  // check if request body is empty or validated
  if (!adId || !ObjectID.isValid(adId)) {
    return res.status(400).json({
      msg: "wrong ad id",
    });
  }

  // retrieve ad information by id
  const ad = await AdsSchema.findById(adId);

  // delete ad if it is existing
  if (ad) {
    // find ad by character id and remove from database
    await AdsSchema.findByIdAndDelete(adid);
    return res.status(200).json({
      msg: "ad successfully removed",
    });
  } else {
    return res.status(403).json({
      msg: "ad is not exisiting",
    });
  }
});

// *** --- fetch all ads informations depends on building ---
router.post("/getAds", async function (req, res, next) {
  const { buildingid } = req.body;
  AdsSchema.find({ buildingid: buildingid })
    .then(function (ads) {
      let response = [];
      ads.map((ad) => {
        response.push({
          buildingid: ad.buildingid,
          floor: ad.floor,
          texture: ad.texture,
          owner: ad.owner,
        });
      });
      return res.status(200).json({
        msg: "retrieved ads informations",
        ads: response,
      });
    })
    .catch(next);
});

router.post("/getAllAds", async function (req, res, next) {
  AdsSchema.find()
    .then(function (ads) {
      let response = [];
      ads.map((ad) => {
        response.push({
          buildingid: ad.buildingid,
          floor: ad.floor,
          texture: ad.texture,
          owner: ad.owner,
        });
      });
      return res.status(200).json({
        msg: "retrieved ads informations",
        ads: response,
      });
    })
    .catch(next);
});

// *** --- export ads router ---
module.exports = router;
