const bcrypt = require('bcryptjs');
const pool = require('../config/db');

const getAllKontraktor = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;

  try {
    let qFilter;
    if (!search) {
      qFilter = "SELECT u.username, u.id AS id_user , d.no_proyek, d.nm_rekanan, d.klasifikasi, d.nm_proyek, d.nm_lokasi FROM users AS u INNER JOIN kontraktor_conn AS k ON u.id = k.id_user INNER JOIN data AS d ON d.id_datum = k.id_datum WHERE role = 'kontraktor' ORDER BY LOWER(u.username) ASC";
    } else {
      qFilter = `SELECT u.username, u.id AS id_user , d.no_proyek, d.nm_rekanan, d.klasifikasi, d.nm_proyek, d.nm_lokasi FROM users AS u INNER JOIN kontraktor_conn AS k ON u.id = k.id_user INNER JOIN data AS d ON d.id_datum = k.id_datum WHERE LOWER(u.username) LIKE LOWER('%${search}%') OR LOWER(d.no_proyek) LIKE LOWER('%${search}%') AND role = 'kontraktor' ORDER BY LOWER(u.username) ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(username) ASC LIMIT ${pageSize} OFFSET ${offset};`);
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
    result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(username) ASC;`);

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
      text: "SELECT u.username, u.id AS id_user , d.no_proyek, d.nm_rekanan, d.klasifikasi, d.nm_proyek, d.nm_lokasi FROM users AS u INNER JOIN kontraktor_conn AS k ON u.id = k.id_user INNER JOIN data AS d ON d.id_datum = k.id_datum WHERE role = 'kontraktor' AND u.id = $1",
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
      message: e.message,
    });
  }
};

// Create user
const createKontraktor = async (req, res) => {
  const {
    noProyek,
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
    const qAddUser = {
      text: 'INSERT INTO users (id, username, password, role) VALUES (DEFAULT, $1, $2, $3) RETURNING id;',
      values: [username, hashPassword, 'kontraktor'],
    };
    const resUser = await pool.query(qAddUser);

    let noProyekStr = '';
    for (let i = 0; i < noProyek.length; i += 1) {
      if (i === noProyek.length - 1) {
        noProyekStr += `'${(noProyek[i])}'`;
      } else {
        noProyekStr += `'${(noProyek[i])}',`;
      }
    }
    const qGetData = {
      text: `SELECT id_datum, no_proyek FROM data WHERE no_proyek in (${noProyekStr})`,
      // values: [noProyekStr],
    };
    const resData = await pool.query(qGetData);

    let qNoKontrak;
    for (let i = 0; i < resData.rows.length; i += 1) {
      qNoKontrak = {
        text: 'INSERT INTO kontraktor_conn (id, id_datum, id_user) VALUES (DEFAULT, $1, $2)',
        values: [
          resData.rows[i].id_datum,
          resUser.rows[0].id,
        ],
      };
      pool.query(qNoKontrak);
    }

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

const updateKontraktor = async (req, res) => {
  const { id } = req.params;
  const {
    noProyek,
    username,
    oldPass,
    newPass,
    confirmNewPass,
  } = req.body;

  try {
    const qGetUser = {
      text: 'SELECT id, password, role FROM users WHERE id=$1',
      values: [id],
    };
    const resGetUser = await pool.query(qGetUser);
    if (resGetUser.rows[0].role !== 'kontraktor') {
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

    let noProyekStr = '';
    for (let i = 0; i < noProyek.length; i += 1) {
      if (i === noProyek.length - 1) {
        noProyekStr += `'${(noProyek[i])}'`;
      } else {
        noProyekStr += `'${(noProyek[i])}',`;
      }
    }
    const qGetData = {
      text: `SELECT id_datum, no_proyek FROM data WHERE no_proyek in (${noProyekStr})`,
      // values: [noProyekStr],
    };
    const resData = await pool.query(qGetData);

    const qDelKontrak = {
      text: 'DELETE FROM kontraktor_conn WHERE id_user = $1',
      values: [id],
    };
    await pool.query(qDelKontrak);
    let qNoKontrak;
    for (let i = 0; i < resData.rows.length; i += 1) {
      qNoKontrak = {
        text: 'INSERT INTO kontraktor_conn (id, id_datum, id_user) VALUES (DEFAULT, $1, $2)',
        values: [
          resData.rows[i].id_datum,
          id,
        ],
      };
      pool.query(qNoKontrak);
    }

    if (oldPass && newPass && confirmNewPass) {
      const passwordIsValid = bcrypt.compareSync(
        oldPass,
        resGetUser.rows[0].password,
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

const deleteKontraktor = async (req, res) => {
  const { id } = req.params;
  try {
    const queryKontraktor = {
      text: 'SELECT * FROM kontraktor_conn WHERE id_user = $1',
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
  updateKontraktor,
};
