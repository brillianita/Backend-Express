const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllStaff = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;

  try {
    let qFilter;
    if (!search) {
      qFilter = "SELECT a.id_user, a.nama, a.sap, a.seksi, u.username, u.role FROM admin_staff AS a INNER JOIN users AS u ON a.id_user = u.id WHERE u.role = 'staff' ORDER BY LOWER (sap) ASC";
    } else {
      qFilter = `SELECT a.id_user, a.nama, a.sap, a.seksi, u.username FROM admin_staff AS a INNER JOIN users AS u ON a.id_user = u.id WHERE LOWER(a.nama) LIKE LOWER('%${search}%') OR LOWER(a.sap) LIKE LOWER('%${search}%') OR LOWER(a.seksi) LIKE LOWER('%${search}%') OR LOWER(u.username) LIKE LOWER('%${search}%') AND u.role = 'staff'  ORDER BY LOWER(a.sap) ASC`;
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
      text: "SELECT a.id_user, a.nama, a.sap, a.seksi, u.username FROM admin_staff AS a INNER JOIN users AS u ON a.id_user = u.id WHERE id_user=$1 AND u.role='staff'",
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
      text: 'INSERT INTO admin_staff (id, nama, sap, seksi, id_user) VALUES (DEFAULT, $1, $2, $3, $4)',
      values: [nama, sap, seksi, resUser.rows[0].id],
    };
    await pool.query(qStaf);
    // await pool.query(qUser);
    return res.status(201).send({
      status: 'success',
      message: 'Register Successfull!',
    });
  } catch (e) {
    return res.status(400).send({
      status: 'fail',
      message: e.message,
    });
  }
};

const updateStaff = async (req, res) => {
  const { id } = req.params;
  const {
    username,
    nama,
    sap,
    seksi,
    oldPass,
    newPass,
    confirmNewPass,
  } = req.body;

  try {
    const query = {
      text: 'SELECT id, password, role FROM users WHERE id=$1',
      values: [id],
    };
    const result = await pool.query(query);
    if (result.rows[0].role !== 'staff') {
      return res.status(401).send({
        status: 'fail',
        message: 'invalid request',
      });
    }
    const qUpUsername = {
      text: 'UPDATE users SET username = $1  WHERE id = $2;',
      values: [username, id],
    };
    await pool.query(qUpUsername);
    const qUpStaff = {
      text: 'UPDATE admin_staff SET nama = $1, sap = $2, seksi = $3  WHERE id_user = $4;',
      values: [nama, sap, seksi, id],
    };
    await pool.query(qUpStaff);

    if (oldPass && newPass && confirmNewPass) {
      const passwordIsValid = bcrypt.compareSync(
        oldPass,
        result.rows[0].password,
      );
      // If the password is not valid, send the error message
      if (!passwordIsValid) {
        return res.status(401).send({
          status: 'fail',
          message: 'Incorrect old password!',
        });
        // throw new AuthenticationError('Invalid Password!');
      }
      const hashPassword = bcrypt.hashSync(newPass, 8);
      if (newPass !== confirmNewPass) {
        return res.status(400).send({
          status: 'fail',
          message: 'Password and confirm password does not match',
        });
      }
      const qUpdatePass = {
        text: 'UPDATE users SET password = $1  WHERE id = $2;',
        values: [hashPassword, id],
      };
      await pool.query(qUpdatePass);
    }
    return res.status(201).send({
      status: 'success',
      message: 'Staff has been updated',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const deleteStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const queryKontraktor = {
      text: 'SELECT * FROM admin_staff WHERE id_user = $1',
      values: [id],
    };
    const resKontraktor = await pool.query(queryKontraktor);
    if (!resKontraktor.rows[0]) {
      return res.status(404).send({
        status: 'fail',
        message: 'user not found',
      });
    }
    const queryDelete = {
      text: 'DELETE FROM users WHERE id=$1',
      values: [id],
    };
    await pool.query(queryDelete);
    return res.status(201).send({
      status: 'success',
      message: 'user has been removed',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

module.exports = {
  createStaff,
  getAllStaff,
  getStaffById,
  deleteStaff,
  updateStaff,
};
