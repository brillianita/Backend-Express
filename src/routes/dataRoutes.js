const { Router } = require('express');
const dataHandler = require('../handler/dataHandler');

const router = Router();

router.get('/data', dataHandler.getData);
router.get('/statdata', dataHandler.getStatistikbyDataStatus);

module.exports = router;
