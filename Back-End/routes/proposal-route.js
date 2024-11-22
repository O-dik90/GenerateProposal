const express = require('express');
const {
  getListProposals,
  getProposal,
  addProposal,
  deleteProposal,
  updateProposal,
} = require('../controller/proposal');

const router = express.Router();

router.post('/get-proposals/:user_id', getListProposals);
router.post('/get-proposal/:proposal_id', getProposal);
router.post('/add-proposal', addProposal);
router.delete('/delete-proposal/:proposal_id', deleteProposal);
router.put('/update-proposal/:proposal_id', updateProposal);

module.exports = router;
