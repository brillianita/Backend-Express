const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllAdmin = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;

  try {
    let qFilter;
    if (!search) {
      qFilter = 'SELECT a.id, a.nama, a.sap, a.seksi, u.username FROM admin AS a INNER JOIN users AS u ON a.id = u.admin_id ORDER BY LOWER (sap) ASC';
    } else {
      qFilter = `SELECT a.id, a.nama, a.sap, a.seksi, u.username FROM admin AS a INNER JOIN users AS u ON a.id = u.admin_id WHERE LOWER(a.nama) LIKE LOWER('%${search}%') OR LOWER(a.sap) LIKE LOWER('%${search}%') OR LOWER(a.seksi) LIKE LOWER('%${search}%') OR LOWER(u.username) LIKE LOWER('%${search}%') ORDER BY LOWER(sap) ASC`;
    }

    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
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

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      text: 'SELECT * FROM admin WHERE id=$1',
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
const createAdmin = async (req, res) => {
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
    const qAdmin = {
      text: 'INSERT INTO admin (id, nama, sap, seksi) VALUES (DEFAULT, $1, $2, $3) RETURNING *',
      values: [nama, sap, seksi],
    };
    const resAdmin = await pool.query(qAdmin);
    const qUser = {
      text: 'INSERT INTO users (id, admin_id, username, password, role) VALUES (DEFAULT, $1, $2, $3, $4);',
      values: [resAdmin.rows[0].id, username, hashPassword, 'admin'],
    };

    await pool.query(qUser);
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

module.exports = {
  createAdmin,
  getAllAdmin,
  getAdminById,
};
