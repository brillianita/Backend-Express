const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllStaff = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;

  try {
    let qFilter;
    if (!search) {
      qFilter = 'SELECT s.id_user, s.nama, s.sap, s.seksi, u.username FROM staff AS s INNER JOIN users AS u ON s.id_user = u.id ORDER BY LOWER (sap) ASC';
    } else {
      qFilter = `SELECT s.id_user, s.nama, s.sap, s.seksi, u.username FROM staff AS s INNER JOIN users AS u ON s.id_user = u.id WHERE LOWER(s.nama) LIKE LOWER('%${search}%') OR LOWER(s.sap) LIKE LOWER('%${search}%') OR LOWER(s.seksi) LIKE LOWER('%${search}%') OR LOWER(u.username) LIKE LOWER('%${search}%') ORDER BY LOWER(s.sap) ASC`;
    }

    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id_user) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(sap) ASC LIMIT ${pageSize} OFFSET ${offset};`);
      return res.status(200).send({
        status: 'success',
        data: result.rows,
        page: {
          page_size: pageSize,
          total_rows: totalRows.rows[0].count,
          total_pages: totalPages,
          current_page: currentPage,
        },
      });
    }
    result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(sap) ASC;`);

    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'fail',
      // message: "Sorry there was a failure on our server."
      message: e.message,
    });
  }
};

const getStaffById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      text: 'SELECT s.id_user, s.nama, s.sap, s.seksi, u.username FROM staff AS s INNER JOIN users AS u ON s.id_user = u.id WHERE id_user=$1',
      values: [id],
    };
    const result = await pool.query(query);

    // Check if data is null
    // if (!result.rows.length) {
    //     throw new NotFoundError(`User Not Found!`);
    // }
    // Check if data is null
    // if (!result.rows.length) {
    //     throw new NotFoundError(`User Not Found!`);
    // }

    return res.status(200).send({
      status: 'success',
      data: result.rows,

    });
  } catch (e) {
    // console.log(e);
    // if (e instanceof ClientError) {
    //     res.status(e.statusCode).send({
    //         status: 'fail',
    //         message: e.message,
    //     })
    // }
    return res.status(500).send({
      status: 'fail',
      message: 'Sorry there was a failure on our server.',
    });
  }
};

// Create user
const createStaff = async (req, res) => {
  const {
    nama,
    sap,
    seksi,
    username,
    password,
    confirmPassword,
  } = req.body;

  try {
    const hashPassword = bcrypt.hashSync(password, 8);
    if (password !== confirmPassword) {
      return res.status(400).send({
        status: 'fail',
        message: 'Password and Confirm Password does not match',
      });
    }
    const qUser = {
      text: 'INSERT INTO users (id, username, password, role) VALUES (DEFAULT, $1, $2, $3) RETURNING *',
      values: [username, hashPassword, 'staff'],
    };

    const resUser = await pool.query(qUser);
    const qStaf = {
      text: 'INSERT INTO staff (id, nama, sap, seksi, id_user) VALUES (DEFAULT, $1, $2, $3, $4)',
      values: [nama, sap, seksi, resUser.rows[0].id],
    };
    await pool.query(qStaf);
    // await pool.query(qUser);
    return res.status(201).json({
      status: 'success',
      message: 'Register Successfull!',
    });
  } catch (e) {
    return res.status(400).json({
      status: 'fail',
      message: e.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const queryKontraktor = {
      text: 'SELECT * FROM staff WHERE id_user = $1',
      values: [id],
    };
    const resKontraktor = await pool.query(queryKontraktor);
    if (!resKontraktor.rows[0]) {
      return res.status(201).json({ message: 'User not found' });
    }
    const queryDelete = {
      text: 'DELETE FROM users WHERE id=$1',
      values: [id],
    };
    await pool.query(queryDelete);
    return res.status(201).json({ message: 'User has been removed' });
  } catch (e) {
    return res.status(403).json(e.message);
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  deleteStaff,
};
