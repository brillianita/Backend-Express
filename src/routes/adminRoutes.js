const { Router } = require('express');
const adminHandler = require('../handler/adminhandler');
const authJwt = require('../middleware/authUser');

const router = Router();

router.post('/admin/tambah', adminHandler.createAdmin);
router.get('/admin', [authJwt.verifyToken, authJwt.isAdmin], adminHandler.getAllAdmin);
router.get('/admin/:id', [authJwt.verifyToken, authJwt.isAdminOrStafOrKontraktor], adminHandler.getAdminById);

module.exports = router;
