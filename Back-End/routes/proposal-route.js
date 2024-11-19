const express = require('express');
const { getMasterData } = require('../controller/proposal');

const router = express.Router();

router.get('/hello', (req, res) => { res.status(200).json({ message: 'Hello from proposal' }); });
router.get('/master-data', getMasterData);

module.exports = router;