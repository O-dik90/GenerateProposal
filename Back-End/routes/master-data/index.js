const express = require("express");
const master  = require("../../controllers/master-data");
const router = express.Router();
const passport = require('../../utils/passport-jwt');
const protect = passport.authenticate('jwt', { session: false });

router.post('/master-dropdown',protect, master.ListData);
router.post('/master-dapus',protect, master.ListDapus);

module.exports = router 