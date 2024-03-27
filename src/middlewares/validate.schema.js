const Joi = require('joi');

const paramIdSchema = Joi.object({
  postId: Joi.string().length(24).hex().required().messages({
    'string.base': 'Invalid Id',
    'string.length': 'Invalid Id',
    'string.hex': 'Invalid Id',
  }),
});

// USER/AUTH SCHEMAS

const signupSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.string()
    .min(6)
    .required()
    .valid(Joi.ref('password'))
    .messages({
      'any.only': 'Confirm password does not match password.',
    }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

// POST SCHEMAS

const createPostSchema = Joi.object({
  title: Joi.string().min(4).required(),
  body: Joi.string().min(10).required(),
});

const postUpdateSchema = Joi.object({
  title: Joi.string().min(4),
  body: Joi.string().min(10),
});

const queryParamSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1).optional(),
  limit: Joi.number().integer().min(1).max(50).default(5).optional(),
  orderBy: Joi.string()
    .valid('createdAt', 'title', 'name')
    .default('createdAt'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
});

module.exports = {
  paramIdSchema,
  signupSchema,
  loginSchema,
  createPostSchema,
  postUpdateSchema,
  queryParamSchema,
};
