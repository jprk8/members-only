const { Router } = require('express');
const postController = require('../controllers/postController');
const postRouter = Router();

postRouter.get('/create-post', postController.createPostGet);
postRouter.post('/create-post', postController.createPostPost);
postRouter.get('/:id', postController.detailsGet);

module.exports = postRouter;