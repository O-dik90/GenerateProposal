const express = require('express');
const MasterData = require('../controller/master-data');

const router = express.Router();

router.post('/master-dropdown', MasterData.masterDropdown);
router.post('/master-dapus', MasterData.masterDapus);

module.exports = router;
