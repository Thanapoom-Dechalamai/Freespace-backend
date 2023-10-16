const router = require('express').Router();
const controller = require('../../controllers/image.controller');

router.get('/getAllAvatars', controller.onGetAllAvatars);

module.exports = router;