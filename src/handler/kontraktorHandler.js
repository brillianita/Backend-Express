const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllKontraktor = async (req, res) => {
  const { page_size, current_page, search } = req.query;
  let result;

  console.log(search)
  try {
      let qFilter;
      if (!search) {
          qFilter = 'SELECT * FROM kontraktor ORDER BY LOWER(nomor_kontrak) ASC'
      }

      // jenis_pekerjaan, nama_pekerjaan, nomor_kontrak, tgl_mulai, tgl_selesai, lokasi_pekerjaan
      else {
          qFilter = `SELECT * FROM kontraktor WHERE jenis_pekerjaan LIKE LOWER('%${search}%') OR nama_pekerjaan LIKE LOWER('%${search}%') OR nomor_kontrak LIKE LOWER('%${search}%') OR lokasi_pekerjaan LIKE LOWER('%${search}%') ORDER BY LOWER(nomor_kontrak) ASC`
      }
      let result = await pool.query(qFilter);
      
      if (page_size && current_page) {
          const total_rows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`); 
          console.log("Total Rows:", total_rows.rows[0].count)
          const total_pages = Math.ceil(total_rows.rows[0].count / page_size);
          const offset = (current_page - 1) * page_size;
          result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nomor_kontrak) ASC LIMIT ${page_size} OFFSET ${offset};`);
          console.log("ini hasil qFilter", result.rows);
          return res.status(200).send({
              status: 'Success',
              data: result.rows,
              page: {
                  page_size: page_size,
                  total_rows: total_rows.rows[0].count,
                  total_pages: total_pages,
                  current_page: current_page,
              }
          });
      } else {
          result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nomor_kontrak) ASC;`)

          return res.status(200).send({
              status: 'Success',
              data: result.rows
          });
      }
      
  } catch (e) {
      return res.status(500).send({
          status: 'failed',
          // message: "Sorry there was a failure on our server."
          message: e.message,
      });
  }
}

// Create user
const createKontraktor = async (req, res) => {
  const { jenis_pekerjaan, nama_pekerjaan, nomor_kontrak, tgl_mulai, tgl_selesai, lokasi_pekerjaan, username, password, confirmPassword } = req.body;


  const hashPassword = bcrypt.hashSync(password, 8);
  if (password != confirmPassword) {
    return res.status(400).send({
      status: "Failed",
      message: "Password and Confirm Password does not match"
    })
  }

  try {
    const qKontraktor = {
      text: "INSERT INTO kontraktor (id, jenis_pekerjaan, nama_pekerjaan, nomor_kontrak, tgl_mulai, tgl_selesai, lokasi_pekerjaan) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6) RETURNING *;",
      values: [jenis_pekerjaan, nama_pekerjaan, nomor_kontrak, tgl_mulai, tgl_selesai, lokasi_pekerjaan]
    }
    const resKontraktor = await pool.query(qKontraktor);

    const qUser = {
      text: "INSERT INTO users (id, kontraktor_id, username, password, role) VALUES (DEFAULT, $1, $2, $3, $4);",
      values: [resKontraktor.rows[0].id, username, hashPassword, "kontraktor"]
    }

    await pool.query(qUser);

    // await pool.query(qUser);
    res.status(201).json({
      status: "Success",
      message: "Register Successfull!"
    });
  } catch (e) {
    res.status(400).json({
      status: "Failed",
      message: e.message
    })
  }
}



module.exports = {
  createKontraktor,
  getAllKontraktor
};
