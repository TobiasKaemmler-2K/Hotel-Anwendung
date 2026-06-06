const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const roomRoutes = require('./routes/roomRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const { apiLimiter, buildCorsOptions, rejectSqlInjectionPatterns } = require('./middleware/security');

const app = express();

app.use(helmet());
app.use(cors(buildCorsOptions()));
app.use(express.json({ limit: '100kb' }));
app.use('/api', apiLimiter);
app.use('/api', rejectSqlInjectionPatterns);

app.get('/api/health', (request, response) => {
  response.json({ status: 'ok' });
});

app.use('/api/rooms', roomRoutes);
app.use('/api/reservations', reservationRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
