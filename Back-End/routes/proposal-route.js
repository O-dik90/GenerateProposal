const express = require('express');
const {
  getListProposals,
  getProposal,
  addProposal,
  deleteProposal,
  updateProposal,
  // initProposal,
} = require('../controller/proposal');
const {
  getListProposalBab,
  updateBabPendahuluan,
  getDetailBab,
  updateBab,
} = require('../controller/proposal-bab');

const { addDapus, updateDapus } = require('../controller/dapus');

const router = express.Router();

// routes/proposals-route.js
router.post('/get-proposals/:user_id', getListProposals);
router.post('/get-proposal/:proposal_id', getProposal);
router.post('/add-proposal', addProposal);
router.delete('/delete-proposal/:proposal_id', deleteProposal);
router.put('/update-proposal/:proposal_id', updateProposal);
// router.post('/init-proposal/:proposal_id', initProposal);

// routes/proposal-bab-route.js
router.post('/get-listProposal-bab/:proposal_id', getListProposalBab);
router.post('/get-detail-bab', getDetailBab);
router.put('/update-bab-pendahuluan', updateBabPendahuluan);
router.put('/update-bab', updateBab);

//routes/dapus
router.post('/gen-dapus', addDapus);
router.put('/update-dapus', updateDapus);

module.exports = router;
