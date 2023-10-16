const router = require('express').Router();
const controller = require('../../controllers/profile.controller');

router.post('/create', controller.onCreate);
router.get('/getAll', controller.onGetAll);
router.get('/getOne', controller.onGetOne);
router.get('/getById', controller.onGetById);
router.put('/edit', controller.onUpdate);
router.delete('/delete', controller.onDelete);
router.put('/follow', controller.onFollow);
router.put('/unfollow', controller.onUnFollow);
router.get('/getImage', controller.onGetProfileImage);
router.post('/getProfileByUsers', controller.onGetProfileListByUsers);

module.exports = router;