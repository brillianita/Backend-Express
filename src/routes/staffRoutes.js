const { Router } = require('express');
const staffHandler = require('../handler/staffhandler');
const authJwt = require('../middleware/authUser');

const router = Router();

router.post('/staff/tambah', staffHandler.createStaff);
router.get('/staff', [authJwt.verifyToken, authJwt.isAdmin], staffHandler.getAllStaff);
router.get('/staff/:id', [authJwt.verifyToken, authJwt.isAdminOrStafOrKontraktor], staffHandler.getStaffById);
router.delete('/staff/:id', staffHandler.deleteStaff);
router.put('/staff/:id', staffHandler.updateStaff);

module.exports = router;
