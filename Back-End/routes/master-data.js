const express = require('express');
const MasterData = require('../controller/master-data');

const router = express.Router();

router.post('/master-dropdown', MasterData.masterDropdown);

module.exports = router;
