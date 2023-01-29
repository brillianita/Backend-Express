const { Router } = require('express');
const adminHandler = require('../handler/adminhandler');

const router = Router();

router.post('/admin/tambah', adminHandler.createAdmin);
router.get('/admin', adminHandler.getAllAdmin);
router.get('/admin/:id', adminHandler.getAdminById);

module.exports = router;
