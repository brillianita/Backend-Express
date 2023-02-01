const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllKontraktor = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;

  try {
    let qFilter;
    if (!search) {
      qFilter = 'SELECT * FROM kontraktor ORDER BY LOWER(nomor_kontrak) ASC';
    } else {
      qFilter = `SELECT * FROM kontraktor WHERE LOWER(jenis_pekerjaan) LIKE LOWER('%${search}%') OR LOWER(nama_pekerjaan) LIKE LOWER('%${search}%') OR LOWER(nomor_kontrak) LIKE LOWER('%${search}%') OR LOWER(kont_pelaksana) LIKE LOWER('%${search}%') OR LOWER(lokasi_pekerjaan) LIKE LOWER('%${search}%') ORDER BY LOWER(nomor_kontrak) ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
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
      text: 'SELECT * FROM kontraktor WHERE id=$1',
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
    const qKontraktor = {
      text: 'INSERT INTO kontraktor (id, jenis_pekerjaan, nama_pekerjaan, nomor_kontrak, kont_pelaksana, lokasi_pekerjaan) VALUES (DEFAULT, $1, $2, $3, $4, $5) RETURNING *;',
      values: [
        jenisPekerjaan,
        namaPekerjaan,
        nomorKontrak,
        kontPelaksana,
        lokasiPekerjaan,
      ],
    };
    const resKontraktor = await pool.query(qKontraktor);

    const qUser = {
      text: 'INSERT INTO users (id, kontraktor_id, username, password, role) VALUES (DEFAULT, $1, $2, $3, $4);',
      values: [resKontraktor.rows[0].id, username, hashPassword, 'kontraktor'],
    };

    await pool.query(qUser);

    // await pool.query(qUser);
    return res.status(201).json({
      status: 'success',
      message: 'Register Successfull!',
    });
  } catch (e) {
    return res.status(500).json({
      status: 'error',
      message: e.message,
    });
  }
};

module.exports = {
  createKontraktor,
  getAllKontraktor,
  getKontraktorById,
};
