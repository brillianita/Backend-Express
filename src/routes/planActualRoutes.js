const { Router } = require('express');
const planActualHandler = require('../handler/planActualHandler');

const router = Router();

router.post('/plan', planActualHandler.addPlan);
router.get('/plan', planActualHandler.getPlan);
router.get('/plan/:idDatum', planActualHandler.getPlanDetail);
router.put('/plan/:idDatum', planActualHandler.editPlanDetail);
router.delete('/plan/:idDatum', planActualHandler.deletePlan);

router.post('/actual', planActualHandler.addActual);
router.get('/actual', planActualHandler.getActual);
router.get('/actual/:idDatum', planActualHandler.getActualDetail);
router.put('/actual/:idDatum', planActualHandler.editActualDetail);
router.delete('/actual/:idDatum', planActualHandler.deleteActual);

router.get('/planactual', planActualHandler.getPlanActual);

module.exports = router;
