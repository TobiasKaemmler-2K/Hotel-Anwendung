const rateLimit = require('express-rate-limit');

const SQL_INJECTION_PATTERN = /(\bunion\s+select\b|\bdrop\s+table\b|\binsert\s+into\b|\bdelete\s+from\b|\bupdate\s+\w+\s+set\b|\bor\s+1\s*=\s*1\b|--|\/\*|\*\/|\bxp_\b)/i;

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests. Please try again later.' }
});

function readAllowedOrigins() {
  const raw = process.env.ALLOWED_ORIGINS || 'http://localhost:4200';
  return raw
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

function buildCorsOptions() {
  const allowedOrigins = readAllowedOrigins();

  return {
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error('CORS origin not allowed'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'X-API-Key']
  };
}

function containsSqlInjectionPattern(input) {
  if (typeof input === 'string') {
    return SQL_INJECTION_PATTERN.test(input);
  }

  if (Array.isArray(input)) {
    return input.some((value) => containsSqlInjectionPattern(value));
  }

  if (input && typeof input === 'object') {
    return Object.values(input).some((value) => containsSqlInjectionPattern(value));
  }

  return false;
}

function rejectSqlInjectionPatterns(request, response, next) {
  if (containsSqlInjectionPattern(request.query) || containsSqlInjectionPattern(request.body) || containsSqlInjectionPattern(request.params)) {
    response.status(400).json({ message: 'Suspicious input detected. Request blocked.' });
    return;
  }

  next();
}

function requireAdminApiKey(request, response, next) {
  const configuredKey = process.env.ADMIN_API_KEY;

  if (!configuredKey) {
    response.status(503).json({ message: 'Admin API key is not configured on server.' });
    return;
  }

  const providedKey = request.header('X-API-Key');
  if (!providedKey || providedKey !== configuredKey) {
    response.status(401).json({ message: 'Unauthorized. Valid API key required.' });
    return;
  }

  next();
}

module.exports = {
  apiLimiter,
  buildCorsOptions,
  rejectSqlInjectionPatterns,
  requireAdminApiKey
};