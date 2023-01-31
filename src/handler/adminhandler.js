const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllAdmin = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;
  // let result;

  console.log(search);
  try {
    let qFilter;
    if (!search) {
      qFilter = 'SELECT * FROM admin ORDER BY LOWER (sap) ASC';
    } else {
      qFilter = `SELECT * FROM admin WHERE nama LIKE LOWER('%${search}%') OR sap LIKE LOWER('%${search}%') OR seksi LIKE LOWER('%${search}%') ORDER BY LOWER(sap) ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
      console.log('Total Rows:', totalRows.rows[0].count);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(sap) ASC LIMIT ${pageSize} OFFSET ${offset};`);
      console.log('ini hasil qFilter', result.rows);

      return res.status(200).send({
        status: 'Success',
        data: result.rows,
        page: {
          pageSize,
          totalRows: totalRows.rows[0].count,
          totalPages,
          currentPage,
        },
      });
    } else {
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(sap) ASC;`);

      return res.status(200).send({
        status: 'Success',
        data: result.rows,
      });
    }
  } catch (e) {
    return res.status(500).send({
      status: 'failed',
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

    return res.status(200).send({
      status: 'Success',
      data: result.rows,
    });
  } catch (e) {
    // console.log(e);
    // if (e instanceof ClientError) {
    //     res.status(e.statusCode).send({
    //         status: 'failed',
    //         message: e.message,
    //     })
    // }
    return res.status(500).send({
      status: 'failed',
      message: 'Sorry there was a failure on our server',
    });
  }
};

// Create user
const createAdmin = async (req, res) => {
  const {
    nama, sap, seksi, username, password, confirmPassword,
  } = req.body;
  const hashPassword = bcrypt.hashSync(password, 8);

  if (password !== confirmPassword) {
    return res.status(400).send({
      status: 'Failed',
      message: 'Password and Confirm Password does not match',
    });
  }
  try {
    const qAdmin = {
      text: 'INSERT INTO admin (id, nama, sap, seksi) VALUES (DEFAULT, $1, $2, $3) RETURNING *;',
      values: [nama, sap, seksi],
    };
    const resAdmin = await pool.query(qAdmin);
    const qUser = {
      text: 'INSERT INTO users (id, admin_id, username, password, role) VALUES (DEFAULT, $1, $2, $3, $4);',
      values: [resAdmin.rows[0].id, username, hashPassword, 'admin'],
    };

    await pool.query(qUser);
    // await pool.query(qUser);
    res.status(201).json({
      status: 'Success',
      message: 'Register Successfull!',
    });
  } catch (e) {
    res.status(400).json({
      status: 'Failed',
      message: e.message,
    });
  }
};

module.exports = {
  createAdmin,
  getAllAdmin,
  getAdminById,
};
