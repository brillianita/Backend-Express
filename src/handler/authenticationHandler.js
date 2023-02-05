const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const refreshTokenHandler = require('./refreshTokenHandler');

const signIn = async (req, res) => {
  const { username, password } = req.body; // To get email and password input from body request
  try {
    const query = {
      text: 'SELECT id, username, password, role FROM users WHERE username=$1',
      values: [username],
    };
    const result = await pool.query(query);

    if (!result.rows.length) {
      return res.status(404).send({
        status: 'fail',
        message: 'User not found!',
      });
    }

    const passwordIsValid = bcrypt.compareSync(
      password,
      result.rows[0].password,
    );

    // If the password is not valid, send the error message
    if (!passwordIsValid) {
      return res.status(401).send({
        status: 'fail',
        message: 'Invalid Password!',
      });
      // throw new AuthenticationError('Invalid Password!');
    }

    // If password valid
    try {
      const token = jwt.sign({ user: result.rows[0].id }, process.env.SECRET, {
        expiresIn: 120,
      });

      const refreshToken = await refreshTokenHandler.createToken(result.rows[0]);

      // If signIn Success, send these response
      return res.status(200).send({
        status: 'success',
        message: 'Login Success',
        userData: {
          id: result.rows[0].id,
          username: result.rows[0].username,
          role: result.rows[0].role,
        },
        token,
        refreshToken,
      });

      // if signIn failed, send these response
    } catch (e) {
      return res.status(500).send({
        status: 'failed',
        message: e.message,
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: 'fail',
      message: 'Sorry there was a failure on our server.',
    });
  }
};

const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (requestToken == null) {
    return res.status(403).json({ msg: 'Refresh Token is required' });
  }
  try {
    const query = {
      text: 'SELECT * FROM refresh_token WHERE token=$1',
      values: [requestToken],
    };
    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(401).send({
        status: 'fail',
        message: 'Your session was expired or Token is not valid! Please make new login request',
      });
    }
    if (refreshTokenHandler.verifyExpiration(result.rows[0])) {
      const queryDelete = {
        text: 'DELETE FROM refresh_token WHERE id=$1',
        values: [result.rows[0].id],
      };
      await pool.query(queryDelete);
      return res.status(401).send({
        status: 'fail',
        message: 'Your session was expired or Token is not valid! Please make new login request',
      });
    }

    const queryUser = {
      text: 'SELECT username, id, role FROM users WHERE id=$1',
      values: [result.rows[0].id],
    };
    await pool.query(queryUser);
    const newAccessToken = jwt.sign({ user: result.rows[0].id_user }, process.env.SECRET, {
      expiresIn: 120,
    });

    return res.status(200).json({
      status: 'success',
      message: 'Token updated!',
      token: newAccessToken,
      refreshToken: result.rows[0].token,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'fail',
      message: 'Sorry there was a failure on our server.',
    });
  }
};

const logOut = async (req, res) => {
  try {
    // eslint-disable-next-line no-shadow
    const { refreshToken } = req.body;

    const queryDelete = {
      text: 'DELETE FROM refresh_token WHERE token=$1',
      values: [refreshToken],
    };
    await pool.query(queryDelete);
    return res.status(201).json({
      status: 'success',
      message: 'Authentications has been removed',
    });
  } catch (e) {
    return res.status(403).json(e.message);
  }
};

module.exports = {
  signIn,
  refreshToken,
  logOut,
};
