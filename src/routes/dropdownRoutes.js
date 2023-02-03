const { Router } = require('express');
const dropdownHandler = require('../handler/dropdown');

const router = Router();

router.get('/dropdownproyek', dropdownHandler.dropdownProyek);

module.exports = router;
