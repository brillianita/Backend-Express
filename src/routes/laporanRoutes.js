const { Router } = require('express');
const laporanHandler = require('../handler/laporanHandler');
const uploadFile = require('../middleware/uploadFile');

const router = Router();
router.post('/laporan/tambah', uploadFile.upload.single('file'), laporanHandler.createLaporan);
router.get('/laporan/', laporanHandler.getListFiles);
router.get('/laporan/:name', laporanHandler.download);

module.exports = router;
