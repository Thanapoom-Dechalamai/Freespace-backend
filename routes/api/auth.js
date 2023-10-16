const express = require('express');
const router = express.Router();
const controller = require('../../controllers/auth.controller');

router.post('/signin', controller.onSignIn);
router.post('/signup', controller.onSignUp);

module.exports = router;