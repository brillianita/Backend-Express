const { Router } = require('express');
const monPrHandler = require('../handler/monprHandler');

const router = Router();

router.get('/monpr', monPrHandler.getMonitoringPR);
router.post('/monpr', monPrHandler.addMonitoringPR);
router.get('/monpr/:idMonitor', monPrHandler.getDetailMonPr);
router.put('/monpr/:idMonitor', monPrHandler.editMonPr);
router.delete('/monpr/:idMonitor', monPrHandler.deleteMonPr);

module.exports = router;
