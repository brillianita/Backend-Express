const { Router } = require('express');
const dataHandler = require('../handler/dataHandler');

const router = Router();

router.get('/data', dataHandler.getData);
router.post('/data', dataHandler.addDatum);

module.exports = router;
