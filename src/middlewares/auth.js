const { verifyToken } = require('../utils');
const { Unauthorized } = require('./error');

const isAuthenticated = (req, res, next) => {
  try {
    let token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Unauthorized('You are not authorized');

    const payload = verifyToken(token);
    if (!req.user) req.user = {}; // Set the user object to empty if no current user
    req.user.id = payload.id;
    next();
  } catch (error) {
    next(error); // Pass any thrown errors to the global error handler
  }
};

module.exports = isAuthenticated;
