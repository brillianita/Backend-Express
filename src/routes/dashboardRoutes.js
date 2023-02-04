const { Router } = require('express');
const dashboardHandler = require('../handler/dashboardHandler');

const router = Router();

router.get('/data', dashboardHandler.getData);
router.get('/statdata', dashboardHandler.getStatistikbyDataStatus);
router.get('/statplanactual/:id_datum', dashboardHandler.getStatistikPlanVsActual);
router.get('/statmonPr', dashboardHandler.getStatistikMonPr);
router.get('/statpicpr', dashboardHandler.getStatistikPrKonstruksi);
router.get('/statpko', dashboardHandler.getStatistikPko);

module.exports = router;
