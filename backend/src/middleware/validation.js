function requirePositiveIntParam(paramName) {
  return (request, response, next) => {
    const rawValue = request.params[paramName];
    const parsed = Number(rawValue);

    if (!Number.isInteger(parsed) || parsed <= 0) {
      response.status(400).json({ message: `Parameter ${paramName} must be a positive integer.` });
      return;
    }

    request.params[paramName] = String(parsed);
    next();
  };
}

module.exports = {
  requirePositiveIntParam
};