const { Router } = require('express');
const laporanHandler = require('../handler/laporanHandler');
const uploadFile = require('../middleware/uploadFile');

const router = Router();
router.post('/laporan/tambah', uploadFile.upload.single('file'), laporanHandler.createLaporan);
router.get('/laporan/:nomorKontrak', laporanHandler.getLaporan);
router.get('/detailLaporan/:id', laporanHandler.getLaporanDetail);
router.get('/file/:name', laporanHandler.download);
router.put('/laporan/edit/:id', uploadFile.upload.single('file'), laporanHandler.updateLaporan);

module.exports = router;
