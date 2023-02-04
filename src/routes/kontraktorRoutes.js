const { Router } = require('express');
const kontraktorHandler = require('../handler/kontraktorHandler');

const router = Router();

router.post('/kontraktor/tambah', kontraktorHandler.createKontraktor);
router.get('/kontraktor', kontraktorHandler.getAllKontraktor);
router.get('/kontraktor/:id', kontraktorHandler.getKontraktorById);
router.delete('/kontraktor/:id', kontraktorHandler.deleteKontraktor);
router.put('/kontraktor/:id', kontraktorHandler.updatePassword);

module.exports = router;
