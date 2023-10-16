const router = require('express').Router();
const { requireAuth } = require('../../helpers/auth.helper');

router.use('/auth', require('./auth'));
router.use('/user', requireAuth, require('./user'));
router.use('/post', requireAuth, require('./post'));
router.use('/profile', requireAuth, require('./profile'));
router.use('/image', require('./image'));

module.exports = router;