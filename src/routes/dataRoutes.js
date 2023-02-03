const { Router } = require('express');
const dataHandler = require('../handler/dataHandler');

const router = Router();

router.get('/data', dataHandler.getData);
router.get('/statdata', dataHandler.getStatistikbyDataStatus);
router.get('/statplanactual/:id_datum', dataHandler.getStatistikPlanVsActual);
router.get('/statmonPr', dataHandler.getStatistikMonPr);
router.get('/statpicpr', dataHandler.getStatistikPrKonstruksi);
router.get('/statpko', dataHandler.getStatistikPko);

module.exports = router;
