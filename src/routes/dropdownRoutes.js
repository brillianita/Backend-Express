const { Router } = require('express');
const dropdownHandler = require('../handler/dropdown');

const router = Router();

router.get('/dropdown/proyek', dropdownHandler.dropdownProyek);
router.get('/dropdown/kontraktor', dropdownHandler.dropdownKontraktor);
router.get('/search', dropdownHandler.searchProyek);

module.exports = router;
