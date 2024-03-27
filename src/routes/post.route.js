const express = require('express');
const postController = require('../controllers/post.controller');
const { asyncWrapper } = require('../utils');
const isAuthenticated = require('../middlewares/auth');

const postRoute = express.Router();

postRoute.get('/', asyncWrapper(postController.getAllPosts));
postRoute.get('/:postId', asyncWrapper(postController.getPost));
postRoute.post('/', isAuthenticated, asyncWrapper(postController.createPost));
postRoute.patch(
  '/:postId',
  isAuthenticated,
  asyncWrapper(postController.updatePost)
);
postRoute.delete(
  '/:postId',
  isAuthenticated,
  asyncWrapper(postController.deletePost)
);

module.exports = postRoute;
