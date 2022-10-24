//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- define API router ---
const router = require("express").Router();

// *** --- add all endpoints ---
router.use("/", require("./user"));
router.use("/", require("./character"));
router.use("/", require("./wallet"));
router.use("/", require("./ads"));
router.use("/", require("./admin"));

router.use(function (err, req, res, next) {
  // validations for API request
  if (err.name === "ValidationError") {
    return res.status(422).json({
      errors: Object.keys(err.errors).reduce(function (errors, key) {
        errors[key] = err.errors[key].message;
        return errors;
      }, {}),
    });
  }
  return next(err);
});

// *** --- export router ---
module.exports = router;