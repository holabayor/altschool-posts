class CustomError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.name = this.constructor.name;
    this.status = statusCode;
    this.success = false;
  }
}

class BadRequest extends CustomError {
  constructor(message) {
    super(400, message);
  }
}

class ResourceNotFound extends CustomError {
  constructor(message) {
    super(404, message);
  }
}

class Unauthorized extends CustomError {
  constructor(message) {
    super(401, message);
  }
}

class Forbidden extends CustomError {
  constructor(message) {
    super(403, message);
  }
}

class Conflict extends CustomError {
  constructor(message) {
    super(409, message);
  }
}

class InvalidInput extends CustomError {
  constructor(message) {
    super(422, message);
  }
}

const routeNotFound = (req, res, next) => {
  const message = 'Route not found';
  res.status(404).json({ success: false, message });
};

const errorHandler = (err, req, res, next) => {
  // For debugging purposes, log the error stack
  // console.log(err.stack);

  const status = err.status || 500;
  const success = err.success || false;
  const message = err.message || 'Internal Server Error';

  const cleanedMessage = message.replace(/"/g, '');
  res.status(status).json({
    success,
    message: cleanedMessage,
  });
};

module.exports = {
  Conflict,
  Forbidden,
  Unauthorized,
  ResourceNotFound,
  BadRequest,
  InvalidInput,
  CustomError,
  routeNotFound,
  errorHandler,
};
