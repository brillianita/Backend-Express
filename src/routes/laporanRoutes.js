const { Router } = require('express');
const laporanHandler = require('../handler/laporanHandler');
const uploadFile = require('../middleware/uploadFile');

const router = Router();

// KONTRAKTOR FEATURE
router.get('/laporan/:noProyek', laporanHandler.getLaporanByNoProyekKont);
router.post('/laporan/tambah', uploadFile.upload.single('file'), laporanHandler.createLaporan);
router.get('/detailLaporan/:id', laporanHandler.getLaporanDetail);
router.get('/file/:name', laporanHandler.download);
router.put('/laporan/edit/:id', uploadFile.upload.single('file'), laporanHandler.updateLaporan);

// STAFF OR ADMIN FEATURE
router.get('/laporan', laporanHandler.getAllLaporan);
router.put('/laporanReview/edit/:id', laporanHandler.updateStat);
router.delete('/laporan/:id', laporanHandler.deleteLaporan);
router.put('/bast/:noProyek', laporanHandler.updateBastStatus);

module.exports = router;
