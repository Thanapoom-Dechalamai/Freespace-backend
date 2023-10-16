const router = require('express').Router();
const controller = require('../../controllers/post.controller');

router.post('/create', controller.onCreatePost);
router.get('/getAll', controller.onGetAllPost);
router.get('/getPostsByUserId', controller.onGetPostsByUserId);
router.get('/getOne', controller.onGetOne);
router.put('/like', controller.onLikePost);
router.put('/unlike', controller.onUnlikePost);
router.delete('/delete', controller.onDeletePost);
router.put('/comment/create', controller.onCreateComment);
router.put('/comment/like', controller.onLikeComment);
router.put('/comment/unlike', controller.onUnlikeComment);
router.put('/comment/delete', controller.onDeleteComment);

module.exports = router;