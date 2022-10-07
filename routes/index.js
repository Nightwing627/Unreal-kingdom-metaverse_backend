//********** Authored by: Alex *********//
//********** Date: September, 2022 *********//
//********** Organization: Cyber Ape Yacht Club *********//

// *** --- define API router --- 
const router = require('express').Router();

// *** --- use router endpoints --- 
router.use('/v1', require('./v1'));

router.get('/', (req, res) => {
  res.send('backend working!')
})

// *** --- export router --- 
module.exports = router;
