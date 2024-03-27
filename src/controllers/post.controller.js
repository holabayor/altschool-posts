const postService = require('./../services/post.service');
const {
  postUpdateSchema,
  createPostSchema,
  queryParamSchema,
  paramIdSchema,
} = require('../middlewares/validate.schema');
const { validate } = require('../utils');

const getPost = async (req, res) => {
  const { postId } = validate(paramIdSchema, req.params);
  const data = await postService.getPostById(postId);
  return res.status(200).json({ message: 'Successfully retrieved Post', data });
};

const getAllPosts = async (req, res) => {
  const values = validate(queryParamSchema, req.query);
  const { page, limit, order, orderBy } = values;

  const data = await postService.getAllPosts(page, limit, order, orderBy);
  return res.status(200).json({ message: 'All posts', data });
};

const createPost = async (req, res) => {
  validate(createPostSchema, req.body);

  const data = await postService.createPost(req.user.id, req.body);
  if (data)
    return res.status(201).json({ message: 'Post created successfully', data });
};

const updatePost = async (req, res) => {
  const { postId } = validate(paramIdSchema, req.params);
  validate(postUpdateSchema, req.body);

  const data = await postService.updatePost(req.user.id, postId, req.body);
  if (data)
    return res.status(201).json({ message: 'Post updated successfully', data });
};

const deletePost = async (req, res) => {
  const { postId } = validate(paramIdSchema, req.params);
  const data = await postService.deletePost(req.user.id, postId);
  if (data) {
    return res.status(200).json({ message: 'Post deleted successfully', data });
  }
};

module.exports = { getPost, getAllPosts, createPost, updatePost, deletePost };
