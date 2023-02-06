const pool = require('../config/db');

const dropdownProyek = async (req, res) => {
  try {
    const queryGet = {
      text: 'SELECT id_datum, nm_proyek FROM data',
    };

    const poolRes = await pool.query(queryGet);
    const data = poolRes.rows;

    return res.status(200).send({
      status: 'success',
      data: {
        dropdown: data,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: 'Gagal mengambil data',
    });
  }
};

const dropdownKontraktor = async (req, res) => {
  try {
    const queryGet = {
      text: 'SELECT id, nomor_kontrak FROM kontraktor',
    };

    const poolRes = await pool.query(queryGet);
    const data = poolRes.rows;

    return res.status(200).send({
      status: 'success',
      data: {
        dropdown: data,
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).send({
      status: 'error',
      message: 'Gagal mengambil data',
    });
  }
};

module.exports = { dropdownProyek, dropdownKontraktor };
