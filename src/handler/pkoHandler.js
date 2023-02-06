const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

const getPko = async (req, res) => {
  const queryGet = {
    text: 'SELECT * FROM pko ORDER BY id_pko',
  };
  const data = await pool.query(queryGet);

  for (let i = 0; i < (data.rows).length; i += 1) {
    data.rows[i].nilai_project = (Number(data.rows[i].nilai_project)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  }
  return res.status(200).send({
    status: 'success',
    data: data.rows,
  });
};

const addPko = async (req, res) => {
  try {
    const {
      tahun, pekerjaan, notifikasi, nomorPo, tglMulai, targetSelesai,
      status, keterangan, nilaiProject, statusPenagihan,
    } = req.body;

    const queryInsert = {
      text: 'INSERT INTO pko (id_pko, tahun, pekerjaan, notifikasi, nomor_po, tgl_mulai, target_selesai, status, keterangan, nilai_project, status_penagihan) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;',
      values: [
        tahun, pekerjaan, notifikasi, nomorPo, tglMulai, targetSelesai,
        status, keterangan, nilaiProject, statusPenagihan,
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
      message: 'Berhasil menambahkan data PKO baru',
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
      message: 'Gagal menambahkan data PKO',
    });
  }
};

const getDetailPko = async (req, res) => {
  try {
    const { idPko } = req.params;

    if (Number.isNaN(Number(idPko))) {
      throw new InvariantError('Gagal mengambil data. Mohon isi idPko proyek dengan benar');
    }

    const queryGet = {
      text: 'SELECT * FROM pko WHERE id_pko = $1',
      values: [idPko],
    };
    const poolRes = await pool.query(queryGet);

    if (!(poolRes.rows[0])) {
      throw new NotFoundError(`Data PKO dengan id: ${idPko} tidak ditemukan`);
    }
    poolRes.rows[0].nilai_project = (Number(poolRes.rows[0].nilai_project)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    return res.status(200).send({
      status: 'success',
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
      message: 'Gagal mengambil data PKO',
    });
  }
};

const editPko = async (req, res) => {
  try {
    const { idPko } = req.params;

    if (!idPko || Number.isNaN(Number(idPko))) {
      throw new InvariantError('Gagal mengedit data PKO. Mohon isi idPko proyek dengan benar');
    }

    const {
      tahun, pekerjaan, notifikasi, nomorPo, tglMulai, targetSelesai,
      status, keterangan, nilaiProject, statusPenagihan,
    } = req.body;

    const queryInsert = {
      text: 'UPDATE pko SET tahun = $1, pekerjaan = $2, notifikasi = $3, nomor_po = $4, tgl_mulai = $5, target_selesai = $6, status = $7, keterangan = $8, nilai_project = $9, status_penagihan = $10 WHERE id_pko = $11 RETURNING *;',
      values: [
        tahun, pekerjaan, notifikasi, nomorPo, tglMulai, targetSelesai,
        status, keterangan, nilaiProject, statusPenagihan, idPko,
      ],
    };

    let poolRes;

    try {
      poolRes = await pool.query(queryInsert);
    } catch (e) {
      throw new InvariantError(e);
    }
    if (!poolRes.rows[0]) {
      throw new NotFoundError(`Tidak dapat menemukan data PKO ${idPko}`);
    }

    return res.status(201).send({
      status: 'success',
      message: 'Berhasil mengedit data PKO',
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
      message: 'Gagal mengedit data PKO',
    });
  }
};

const deletePko = async (req, res) => {
  try {
    const { idPko } = req.params;

    if (!idPko || Number.isNaN(Number(idPko))) {
      throw new InvariantError('Gagal menghapus data PKO. Mohon isi idPko proyek dengan benar');
    }

    const queryDel = {
      text: 'DELETE FROM pko WHERE id_pko = $1 RETURNING pekerjaan',
      values: [idPko],
    };
    const poolDel = await pool.query(queryDel);

    if (!(poolDel.rows[0])) {
      throw new NotFoundError(`Data PKO dengan id: ${idPko} tidak ditemukan`);
    }

    return res.status(200).send({
      status: 'success',
      message: `Data PKO ${poolDel.rows[0].pekerjaan} berhasil dihapus`,
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
      message: 'Gagal menghapus data PKO',
    });
  }
};

module.exports = {
  getPko, addPko, getDetailPko, editPko, deletePko,
};
