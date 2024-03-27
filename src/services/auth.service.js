const {
  ResourceNotFound,
  Unauthorized,
  Conflict,
} = require('../middlewares/error');
const User = require('../models/users.model');
const { comparePassword, generateToken, hashPassword } = require('../utils');

const getUserById = async (id) => {
  const user = await User.findByPk(id);
  return user;
};

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
  return user;
};

const createUser = async (payload) => {
  const userExists = await getUserByEmail(payload.email);
  if (userExists) throw new Conflict('User already exists');

  const hashedPassword = await hashPassword(payload.password);
  const user = await User.create({ ...payload, password: hashedPassword });

  return user;
};

const login = async (email, password) => {
  const user = await getUserByEmail(email);
  if (!user) throw new ResourceNotFound('User not found');

  const isValidPassword = await comparePassword(password, user.password);
  if (!isValidPassword) throw new Unauthorized('Invalid login credentials');

  // Generate access token
  const accessToken = generateToken({ id: user.id, firstName: user.firstName });

  return { accessToken, user: user.toJSON() };
};

const updateUser = async (id, payload) => {
  const user = await getUserById(id);
  if (!user) throw new ResourceNotFound('User not found');

  if (payload.password) {
    payload.password = await hashPassword(payload.password);
  }

  await user.update(payload);
  return user;
};

module.exports = {
  createUser,
  login,
};
