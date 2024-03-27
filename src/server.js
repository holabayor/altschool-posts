const dotenv = require('dotenv');
dotenv.config();
const http = require('http');
const express = require('express');
const { connectDB } = require('./config/db');
const authRoute = require('./routes/auth.route');
const { errorHandler, routeNotFound } = require('./middlewares/error');
const postRoute = require('./routes/post.route');

// Initialize express app
const app = express();
const port = parseInt(process.env.PORT || '8900');

// Middlewares
app.use(express.json());

// Routes
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

// Error handling middlewares
app.use(errorHandler);
app.use(routeNotFound);

// Create server
const server = http.createServer(app);

// Start application with DB connection
connectDB()
  .then(() => {
    server.listen(port, () => {
      console.log(`⚡️Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
    process.exit(1);
  });

// Note: This code directly initiates actions and lacks the structure provided by functions or classes. It connects to the database and starts the server as soon as the script runs.
