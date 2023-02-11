const { Router } = require('express');
const planActualHandler = require('../handler/planActualHandler');

const router = Router();

router.post('/plan', planActualHandler.addPlan);
router.get('/plan', planActualHandler.getPlan);
router.get('/plan/:idDatum', planActualHandler.getPlanDetail);
router.put('/plan/:idDatum', planActualHandler.editPlanDetail);
router.delete('/plan/:idDatum', planActualHandler.deletePlan);

module.exports = router;
