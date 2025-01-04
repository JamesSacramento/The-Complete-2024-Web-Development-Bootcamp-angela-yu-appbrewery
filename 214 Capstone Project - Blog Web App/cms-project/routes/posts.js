const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/new', postController.newPost);
router.post('/create', postController.createPost);
router.get('/:id/edit', postController.editPost);
router.post('/:id/update', postController.updatePost);
router.post('/:id/delete', postController.deletePost);
router.get('/:id', postController.getPostById);

module.exports = router;
