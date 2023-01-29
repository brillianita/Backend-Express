const { Router } = require('express');
const kontraktorHandler = require('../handler/kontraktorHandler');

const router = Router();

router.post('/kontraktor/tambah', kontraktorHandler.createKontraktor);
router.get('/kontraktor', kontraktorHandler.getAllKontraktor);

module.exports = router;
