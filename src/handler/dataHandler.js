const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');

const addDatum = async (req, res) => {
  try {
    const {
      nmJenis,
      tahun,
      noProyek,
      namaProyek,
      namaRekanan,
      tglMulai,
      tglAkhir,
      nilai,
      nmKota,
      nmLokasi,
      keterangan,
    } = req.body;

    const queryInsert = {
      text: 'INSERT INTO data (id_datum, nm_jenis, tahun, no_proyek, nm_proyek, nm_rekanan, tgl_mulai, tgl_akhir, nilai, nm_kota, nm_lokasi, keterangan) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;',
      values: [
        nmJenis, tahun, noProyek, namaProyek, namaRekanan, tglMulai,
        tglAkhir, nilai, nmKota, nmLokasi, keterangan,
      ],
    };

    let poolRes;

    try {
      poolRes = await pool.query(queryInsert);
    } catch (e) {
      throw new InvariantError(e);
    }

    return res.status(201).send({
      status: 'success',
      message: 'Berhasil menambahkan data baru',
      data: poolRes.rows[0],
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
      message: 'Gagal menambahkan data',
    });
  }
};

const getData = async (req, res) => {
  const queryGet = {
    text: 'SELECT * FROM data',
  };
  const data = await pool.query(queryGet);
  // console.log(data.rows);

  return res.status(200).send({
    status: 'success',
    data: data.rows,
  });
};

module.exports = {
  getData, addDatum,
};
