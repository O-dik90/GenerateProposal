const express = require("express");
const { getProposals, getProposal, updateProposal, deleteProposal, createProposal, getBabProposal } = require("../../controllers/proposals");
const router = express.Router();

const passport = require('../../utils/passport-jwt');
const protect = passport.authenticate('jwt', { session: false });

router.get('/get-proposals/:user_id',protect, getProposals);
router.post('/get-proposal/:user_id', protect,getProposal);
router.post('/create-proposal/:user_id',protect, createProposal);
router.put('/update-proposal/:user_id',protect, updateProposal);
router.delete('/delete-proposal/:item_id',protect, deleteProposal);

module.exports = router 