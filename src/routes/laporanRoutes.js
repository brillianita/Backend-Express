const { Router } = require('express');
const laporanHandler = require('../handler/laporanHandler');
const uploadFile = require('../middleware/uploadFile');

const router = Router();

// KONTRAKTOR FEATURE
router.get('/laporan/:nomorKontrak', laporanHandler.getLaporan);
router.post('/laporan/tambah', uploadFile.upload.single('file'), laporanHandler.createLaporan);
router.get('/noProyek', laporanHandler.getNoProyek);
router.get('/nmProyek', laporanHandler.getNamaProyek);
router.get('/detailLaporan/:id', laporanHandler.getLaporanDetail);
router.get('/file/:name', laporanHandler.download);
router.put('/laporan/edit/:id', uploadFile.upload.single('file'), laporanHandler.updateLaporan);

// STAFF OR ADMIN FEATURE
router.get('/allLaporan', laporanHandler.getAllLaporan);
router.put('/laporanStat/edit/:id', laporanHandler.updateStat);
router.delete('/laporan/:id', laporanHandler.deleteLaporan);

module.exports = router;
