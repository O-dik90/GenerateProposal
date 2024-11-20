const express = require('express');
const { getListProposals, addProposal, deleteProposal,getProposal, updateProposal } = require('../controller/proposal');

const router = express.Router();

router.get('/get-proposals/:id', getListProposals);
router.post('/add-proposal', addProposal);
router.delete('/delete-proposal/:proposal_id', deleteProposal);
router.get('/get-proposal/:proposal_id', getProposal);
router.put('/update-proposal/:proposal_id', updateProposal);

module.exports = router;