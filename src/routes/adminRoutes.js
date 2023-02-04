const { Router } = require('express');
const adminHandler = require('../handler/adminHandler');

const router = Router();

router.post('/admin/tambah', adminHandler.createAdmin);
router.get('/admin', adminHandler.getAllAdmin);
router.get('/admin/:id', adminHandler.getAdminById);
router.put('/admin/:id', adminHandler.updatePassword);

module.exports = router;
