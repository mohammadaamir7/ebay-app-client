const express = require('express');
const router = express.Router();

const { signUp, signIn, resetPasswordEmail, validateToken } = require('./account.controller');
const { signUpValidation } = require('./account.middleware');

router.post('/sign-up', signUpValidation, signUp);
router.post('/sign-in', signIn);

router.get('/profile/send-code', resetPasswordEmail);
router.post('/profile/verify-code', resetPasswordEmail);

router.get('/validate-token', validateToken);

module.exports = router;