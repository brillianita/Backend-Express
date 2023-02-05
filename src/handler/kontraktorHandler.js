const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllKontraktor = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;

  try {
    let qFilter;
    if (!search) {
      qFilter = 'SELECT k.jenis_pekerjaan, k.nama_pekerjaan, k.nomor_kontrak, k.lokasi_pekerjaan, k.kont_pelaksana, k.id_user, u.username FROM kontraktor AS k INNER JOIN users AS u ON k.id_user = u.id ORDER BY LOWER(k.nomor_kontrak) ASC';
    } else {
      qFilter = `SELECT k.jenis_pekerjaan, k.nama_pekerjaan, k.nomor_kontrak, k.lokasi_pekerjaan, k.kont_pelaksana, k.id_user, u.username FROM kontraktor AS k INNER JOIN users AS u ON k.id_user = u.id WHERE LOWER(jenis_pekerjaan) LIKE LOWER('%${search}%') OR LOWER(nama_pekerjaan) LIKE LOWER('%${search}%') OR LOWER(nomor_kontrak) LIKE LOWER('%${search}%') OR LOWER(kont_pelaksana) LIKE LOWER('%${search}%') OR LOWER(lokasi_pekerjaan) LIKE LOWER('%${search}%') OR LOWER(u.username) LIKE LOWER('%${search}%') ORDER BY LOWER(nomor_kontrak) ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id_user) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nomor_kontrak) ASC LIMIT ${pageSize} OFFSET ${offset};`);
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
    result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nomor_kontrak) ASC;`);

    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      // message: "Sorry there was a failure on our server."
      message: e.message,
    });
  }
};

const getKontraktorById = async (req, res) => {
  try {
    const { id } = req.params;
    const query = {
      text: 'SELECT k.jenis_pekerjaan, k.nama_pekerjaan, k.nomor_kontrak, k.lokasi_pekerjaan, k.kont_pelaksana, k.id_user, u.username FROM kontraktor AS k INNER JOIN users AS u ON k.id_user = u.id WHERE id_user=$1',
      values: [id],
    };
    const result = await pool.query(query);

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
      status: 'error',
      message: 'Sorry there was a failure on our server.',
    });
  }
};

// Create user
const createKontraktor = async (req, res) => {
  const {
    jenisPekerjaan,
    namaPekerjaan,
    nomorKontrak,
    kontPelaksana,
    lokasiPekerjaan,
    username,
    password,
    confirmPassword,
  } = req.body;

  const hashPassword = bcrypt.hashSync(password, 8);
  if (password !== confirmPassword) {
    return res.status(400).send({
      status: 'fail',
      message: 'Password and Confirm Password does not match',
    });
  }

  try {
    const qUser = {
      text: 'INSERT INTO users (id, username, password, role) VALUES (DEFAULT, $1, $2, $3) RETURNING *;',
      values: [username, hashPassword, 'kontraktor'],
    };
    const resUser = await pool.query(qUser);
    const qKontraktor = {
      text: 'INSERT INTO kontraktor (id, jenis_pekerjaan, nama_pekerjaan, nomor_kontrak, kont_pelaksana, lokasi_pekerjaan, id_user) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6)',
      values: [
        jenisPekerjaan,
        namaPekerjaan,
        nomorKontrak,
        kontPelaksana,
        lokasiPekerjaan,
        resUser.rows[0].id,
      ],
    };
    await pool.query(qKontraktor);

    // await pool.query(qUser);
    return res.status(201).send({
      status: 'success',
      message: 'Register Successfull!',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const updatePassword = async (req, res) => {
  const { id } = req.params;
  const {
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
    if (result.rows[0].role !== 'kontraktor') {
      return res.status(401).send({
        status: 'fail',
        message: 'invalid request',
      });
    }
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
    return res.status(201).send({
      status: 'success',
      message: 'password has updated',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const deleteKontraktor = async (req, res) => {
  const { id } = req.params;
  try {
    const queryKontraktor = {
      text: 'SELECT * FROM kontraktor WHERE id_user = $1',
      values: [id],
    };
    const resKontraktor = await pool.query(queryKontraktor);
    if (!resKontraktor.rows[0]) {
      return res.status(404).send({
        status: 'fail',
        message: 'User not found',
      });
    }
    const queryDelete = {
      text: 'DELETE FROM users WHERE id=$1',
      values: [id],
    };
    await pool.query(queryDelete);
    return res.status(201).send({
      status: 'success',
      message: 'User has been removed',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

module.exports = {
  createKontraktor,
  getAllKontraktor,
  getKontraktorById,
  deleteKontraktor,
  updatePassword,
};
