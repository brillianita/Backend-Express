const { Router } = require('express');
const authHandler = require('../handler/authenticationHandler');
const authJwt = require('../middleware/authUser');

const router = Router();
router.post('/login', authHandler.signIn);
router.put('/refreshtoken', authHandler.refreshToken);
router.delete('/logout', [authJwt.verifyToken, authJwt.isAdminOrStafOrKontraktor], authHandler.logOut);

module.exports = router;
