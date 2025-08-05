const pool = require('../config/db');


const getUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};


const createUser = async (username, email, hashedPassword) => {
  await pool.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
    [username, email, hashedPassword]
  );
};

module.exports = {
  getUserByEmail,
  createUser,
};

