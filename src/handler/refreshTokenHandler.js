const { v4: uuidv4 } = require('uuid');
const pool = require('../config/db');

// Create refresh token
// eslint-disable-next-line consistent-return
const createToken = async (user) => {
  const tanggalSkrg = new Date();

  const expiredAt = new Date(tanggalSkrg.getTime() + 1000 * 18000);

  // Generate refresh token by uuidv4 library

  const tokenRefresh = uuidv4();

  // Insert the token field in refresh_token table
  const query = {
    text: 'INSERT INTO refresh_token (id, token, tanggal_expired, user_id) VALUES (DEFAULT, $1, $2, $3) RETURNING *',
    values: [tokenRefresh, expiredAt, user.id],
  };
  const result = await pool.query(query);
  return result.rows[0].token;
};

// Check the time for token expiration date
// eslint-disable-next-line arrow-body-style
const verifyExpiration = (token) => {
  return token.tanggal_expired.getTime() < new Date().getTime();
};

module.exports = {
  createToken,
  verifyExpiration,
};
