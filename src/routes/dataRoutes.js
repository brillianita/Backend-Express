const { Router } = require('express');
const dataHandler = require('../handler/dataHandler');

const router = Router();

router.get('/data', dataHandler.getData);
router.get('/statdata', dataHandler.getStatistikbyDataStatus);
router.get('/statPlanActual/:id_datum', dataHandler.getStatistikPlanVsActual);
router.get('/statMonPr', dataHandler.getStatistikMonPr);
router.get('/statPicPr', dataHandler.getStatistikPrKonstruksi);

module.exports = router;
