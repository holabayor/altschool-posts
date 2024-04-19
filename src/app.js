const express = require('express');
const morgan = require('morgan');
const authRoute = require('./routes/auth.route');
const postRoute = require('./routes/post.route');
const { errorHandler, routeNotFound } = require('./middlewares/error');

// Initialize express app
const app = express();

// Middlewares
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

// Error handling middlewares
app.use(errorHandler);
app.use(routeNotFound);

module.exports = app;
