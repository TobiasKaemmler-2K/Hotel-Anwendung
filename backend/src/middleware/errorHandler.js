function notFoundHandler(request, response) {
  response.status(404).json({ message: 'Route not found' });
}

function errorHandler(error, request, response, next) {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';

  if (process.env.NODE_ENV !== 'test') {
    console.error(error);
  }

  response.status(statusCode).json({ message });
}

module.exports = {
  notFoundHandler,
  errorHandler
};
