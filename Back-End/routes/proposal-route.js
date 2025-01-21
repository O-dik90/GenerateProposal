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

const { updateDapus, genCitations } = require('../controller/dapus');
const { addFiles } = require('../controller/lampiran');

const router = express.Router();

// routes/proposals-route.js
router.post('/get-proposals/:user_id', getListProposals);
router.post('/get-proposal/:proposals_id', getProposal);
router.post('/add-proposal', addProposal);
router.delete('/delete-proposal/:proposals_id', deleteProposal);
router.put('/update-proposal/:proposals_id', updateProposal);
// router.post('/init-proposal/:proposals_id', initProposal);

// routes/proposal-bab-route.js
router.post('/get-listProposal-bab/:proposals_id', getListProposalBab);
router.post('/get-detail-bab', getDetailBab);
router.put('/update-bab-pendahuluan', updateBabPendahuluan);
router.put('/update-bab', updateBab);

//routes/dapus
router.put('/update-dapus', updateDapus);
router.post('/gen-citations', genCitations);

//routes/file-uploads
router.post('/upload-file/:proposals_id', addFiles);

module.exports = router;
