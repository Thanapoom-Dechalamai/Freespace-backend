const express = require('express');
const router = express.Router();
const controller = require('../../controllers/user.controller');

router.get('/getUserInfo', controller.onGetUserInfo);

module.exports = router;