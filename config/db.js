const { Pool } = require('pg');
require('dotenv').config();

// Create a new pool instance
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

const connectDB = async () => {
  try {
    await pool.connect();
    console.log('Connected to PostgreSQL database successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
};

module.exports = { pool, connectDB };