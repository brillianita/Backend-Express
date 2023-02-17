const { Router } = require('express');
const dashboardHandler = require('../handler/dashboardHandler');

const router = Router();

router.get('/stat/data', dashboardHandler.getStatistikbyDataStatus);
router.get('/stat/planactual/:id_datum', dashboardHandler.getStatistikPlanVsActual);
router.get('/stat/monPr', dashboardHandler.getStatistikMonPr);
router.get('/stat/picpr', dashboardHandler.getStatistikPrKonstruksi);
router.get('/stat/pko', dashboardHandler.getStatistikPko);
router.get('/stat/progress', dashboardHandler.getProgress);

module.exports = router;
