const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,       // défini dans ton .env
  host: process.env.DB_HOST,       // ex: localhost
  database: process.env.DB_NAME,   // ex: bank_comparison
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

module.exports = pool;