const express = require('express');
const authController = require('../controllers/auth.controller');
const { asyncWrapper } = require('../utils');
const isAuthenticated = require('../middlewares/auth');

const authRoute = express.Router();

authRoute.post('/register', asyncWrapper(authController.signup));
authRoute.post('/login', asyncWrapper(authController.login));
authRoute.get('/me', isAuthenticated, asyncWrapper(authController.getUser));

module.exports = authRoute;
