const { Router } = require('express');
const laporanHandler = require('../handler/proyekHandler');

const router = Router();

router.get('/proyek', laporanHandler.getAllProyek);
router.get('/proyek/:idUser', laporanHandler.getProyekByIdKontraktor);

module.exports = router;
