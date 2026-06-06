const dotenv = require('dotenv');
const app = require('./app');
const { initializeDatabase } = require('./config/database');

dotenv.config();

const port = process.env.PORT || 3000;

async function startServer() {
  try {
    await initializeDatabase();
    app.listen(port, () => {
      console.log(`Hotel backend is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

startServer();
