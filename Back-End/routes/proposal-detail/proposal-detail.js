const express = require('express');
const router = express.Router();
const ProposalAttachsController = require('../../controllers/proposal-detail/proposal_attachs');
const ProposalDetailsController = require('../../controllers/proposal-detail/proposal_detail');
const PropsalDapus = require('../../controllers/daftar-pustaka/index');
const passport = require('../../utils/passport-jwt');
const protect = passport.authenticate('jwt', { session: false });

router.post('/get-files/:proposal_id', protect, ProposalAttachsController.filesGet);
router.post('/add-file/:proposal_id', protect,ProposalAttachsController.upload, ProposalAttachsController.filesAdd);
router.delete('/delete-file/:item_id', protect, ProposalAttachsController.filesDelete);
router.put('/update-file/:proposal_id', protect, ProposalAttachsController.upload, ProposalAttachsController.filesUpdate);
router.get('/download-file/:item_id',ProposalAttachsController.fileDownloadAsBase64);


router.post('/get-bab-proposal/:proposal_id', protect, ProposalDetailsController.getBabProposalDetail);
router.put('/update-bab-proposal/:proposal_id', protect, ProposalDetailsController.updateProposalDetail);

router.post('/gen-citations', PropsalDapus.genCitations);

module.exports = router 