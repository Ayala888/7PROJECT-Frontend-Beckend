const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: 'postgresql://ayala:Lh9dXmULttoduYU3mkiDYX80qJZp7PeZ@dpg-d28rncvdiees73f9tmj0-a.oregon-postgres.render.com/project7_db',
  ssl: { rejectUnauthorized: false}
});

module.exports = pool;