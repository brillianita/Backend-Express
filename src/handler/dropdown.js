const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

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

const searchProyek = async (req, res) => {
  try {
    const { find } = req.query;
    const findLike = find.concat('%');

    if (!find) {
      throw new InvariantError('Gagal mengambil data. Mohon isi kata kunci pencarian (find)');
    }

    const queryGet = {
      text: 'SELECT id_datum, nm_proyek, no_proyek, nm_rekanan, nm_jenis, nm_proyek, nm_lokasi FROM data WHERE LOWER(no_proyek) LIKE LOWER($1) OR LOWER(nm_proyek) LIKE LOWER($1)',
      values: [findLike],
    };

    const poolRes = await pool.query(queryGet);
    const data = poolRes.rows;

    if (!(data.length)) {
      throw new NotFoundError(`Nomor Proyek ${find} tidak ditemukan`);
    }

    return res.status(200).send({
      status: 'success',
      data: {
        search: data,
      },
    });
  } catch (e) {
    console.error(e);

    if (e instanceof ClientError) {
      return res.status(400).send({
        status: 'fail',
        message: e.message,
      });
    }
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

module.exports = { dropdownProyek, dropdownKontraktor, searchProyek };
