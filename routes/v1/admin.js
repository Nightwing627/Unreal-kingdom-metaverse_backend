//********** Authored by: Alex *********//
//********** Date: October, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- import router and database models
const mongoose = require("mongoose");
const router = require("express").Router();
const AdminSchema = mongoose.model("AdminSchema");

const axios = require("axios").default;

require("dotenv/config");

// *** --- update download URL request ---
router.post("/updateDownloadURL", async function (req, res, next) {
  const { newURL } = req.body;

  // check if request body is empty or validated
  if (!newURL) {
    return res.status(400).json({
      msg: "couldn't be blank",
    });
  }

  // update download URL
  let admin = await AdminSchema.findOne({ privillege: "admin" });

  // check if admin is available
  if (admin) {
    console.log("happen here");
    admin.downloadURL = newURL;
    admin.privillege = "admin";
    await admin.save();

    return res.status(200).json({
      msg: "admin info updated",
    });
  } else {
    console.log("happen second");
    let newAdmin = new AdminSchema({
      downloadURL: newURL,
      privillege: "admin",
    });
    await newAdmin.save();
    return res.status(200).json({
      msg: "admin info updated",
    });
  }
});

// *** --- get download URL request ---
router.post("/getDownloadURL", async function (req, res, next) {
  // retrieve admin info
  const admin = await AdminSchema.findOne({ privillege: "admin" });

  // get admin info
  if (admin) {
    // retrieve download URL
    return res.status(200).json({
      msg: "retrieve downloadURL",
      downloadURL: admin.downloadURL,
    });
  } else {
    return res.status(403).json({
      msg: "admin not exisiting",
    });
  }
});

// *** --- export admin router ---
module.exports = router;
