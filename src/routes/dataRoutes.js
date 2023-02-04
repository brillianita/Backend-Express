const { Router } = require('express');
const dataHandler = require('../handler/dataHandler');

const router = Router();

router.get('/data', dataHandler.getData);
router.get('/data/:idDatum', dataHandler.getDatum);
router.post('/data', dataHandler.addDatum);
router.put('/data/:idDatum', dataHandler.editDatum);
router.delete('/data/:idDatum', dataHandler.deleteDatum);
router.delete('/data', dataHandler.deleteDatum);

module.exports = router;
