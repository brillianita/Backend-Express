const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllAdmin = async (req, res) => {
  const { page_size, current_page, search } = req.query;
  let result;

  console.log(search)
  try {
      let qFilter;
      if (!search) {
          qFilter = 'SELECT * FROM admin ORDER BY LOWER (sap) ASC'
      }

      else {
          qFilter = `SELECT * FROM admin WHERE nama LIKE LOWER('%${search}%') OR sap LIKE LOWER('%${search}%') OR seksi LIKE LOWER('%${search}%') ORDER BY LOWER(sap) ASC`
      }
      let result = await pool.query(qFilter);
      
      if (page_size && current_page) {
          const total_rows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`); 
          console.log("Total Rows:", total_rows.rows[0].count)
          const total_pages = Math.ceil(total_rows.rows[0].count / page_size);
          const offset = (current_page - 1) * page_size;
          result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(sap) ASC LIMIT ${page_size} OFFSET ${offset};`);
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
          result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(sap) ASC;`)

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

const getAdminById = async (req, res) => {
  try {
      const id = req.params.id;
      const query = {
          text: "SELECT * FROM admin WHERE id=$1",
          values: [id]
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
          message: "Sorry there was a failure on our server.",
      });
  }
}

// Create user
const createAdmin = async (req, res) => {
  const { nama, sap, seksi, username, password, confirmPassword } = req.body;


  const hashPassword = bcrypt.hashSync(password, 8);
  if (password != confirmPassword) {
    return res.status(400).send({
      status: "Failed",
      message: "Password and Confirm Password does not match"
    })
  }

  try {
    const qAdmin = {
      text: "INSERT INTO admin (id, nama, sap, seksi) VALUES (DEFAULT, $1, $2, $3) RETURNING *;",
      values: [nama, sap, seksi]
    }
    const resAdmin = await pool.query(qAdmin);

    const qUser = {
      text: "INSERT INTO users (id, admin_id, username, password, role) VALUES (DEFAULT, $1, $2, $3, $4);",
      values: [resAdmin.rows[0].id, username, hashPassword, "admin"]
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
  createAdmin,
  getAllAdmin,
  getAdminById
};
