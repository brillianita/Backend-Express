const { Router } = require('express');
const pkoHandler = require('../handler/pkoHandler');

const router = Router();

router.get('/pko', pkoHandler.getPko);
router.post('/pko', pkoHandler.addPko);
router.get('/pko/:idPko', pkoHandler.getDetailPko);
router.put('/pko/:idPko', pkoHandler.editPko);
router.delete('/pko/:idPko', pkoHandler.deletePko);

module.exports = router;
