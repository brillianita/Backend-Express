const { Router } = require('express');
const authHandler = require('../handler/authenticationHandler');

const router = Router();
router.post('/login', authHandler.signIn);
router.put('/refreshtoken', authHandler.refreshToken);
router.delete('/logout', authHandler.logOut);

module.exports = router;
