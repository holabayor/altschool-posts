const Post = require('../models/posts.model');
const { ResourceNotFound, Forbidden } = require('../middlewares/error');

const getPostById = async (id) => {
  const post = await Post.findOne({ _id: id }).populate('user');
  if (post) return post;
  throw new ResourceNotFound('Post not found');
};

const getAllPosts = async (page, limit, order, orderBy) => {
  const skip = (page - 1) * limit;
  const posts = await Post.find()
    .populate('user')
    .skip(skip)
    .limit(limit)
    .sort([[orderBy, order]]);
  return posts;
};

const createPost = async (userId, payload) => {
  const post = await new Post({ ...payload, user: userId }).populate('user');
  await post.save();
  return post;
};

const updatePost = async (userId, postId, payload) => {
  const postExists = await Post.findById(postId);
  if (!postExists) throw new ResourceNotFound('Post not found');

  const post = await Post.findOneAndUpdate(
    { _id: postId, user: userId },
    { $set: payload },
    { new: true }
  ).populate('user');

  if (!post) throw new Forbidden('You are not authorized to update this post');
  return post;
};

const deletePost = async (userId, postId) => {
  const postExists = await Post.findById(postId);
  if (!postExists) throw new ResourceNotFound('Post not found');

  const post = await Post.findOneAndDelete({
    _id: postId,
    user: userId,
  }).populate('user');
  if (!post) throw new Forbidden('You are not authorized to delete this post');

  return post;
};

module.exports = {
  getPostById,
  getAllPosts,
  createPost,
  updatePost,
  deletePost,
};
