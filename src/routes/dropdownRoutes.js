const { Router } = require('express');
const dropdownHandler = require('../handler/dropdown');

const router = Router();

router.get('/dropdownProyek', dropdownHandler.dropdownProyek);

module.exports = router;
