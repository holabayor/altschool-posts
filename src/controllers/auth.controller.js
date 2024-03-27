const authService = require('./../services/auth.service');
const { loginSchema, signupSchema } = require('../middlewares/validate.schema');
const { validate } = require('../utils');

const getUser = async (req, res) => {
  const user = await authService.getUserById(req.user.id);
  return res.status(200).json({ message: 'Successfully retrieved User' });
};

const signup = async (req, res) => {
  validate(signupSchema, req.body);

  const data = await authService.createUser(req.body);
  if (data)
    return res.status(201).json({ message: 'User created successfully', data });
};

const login = async (req, res) => {
  validate(loginSchema, req.body);

  const { email, password } = req.body;

  const data = await authService.login(email, password);
  if (data) {
    return res.status(200).json({ message: 'Log in successful', data });
  }
};

module.exports = { getUser, signup, login };
