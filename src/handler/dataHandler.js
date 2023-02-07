const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

const addDatum = async (req, res) => {
  try {
    const {
      nmJenis, tahun, noProyek, namaProyek, namaRekanan,
      tglMulai, tglAkhir, nilai, nmKota, nmLokasi, keterangan, noKontrak,
    } = req.body;

    const queryInsert = {
      text: 'INSERT INTO data (id_datum, nm_jenis, tahun, no_proyek, nm_proyek, nm_rekanan, tgl_mulai, tgl_akhir, nilai, nm_kota, nm_lokasi, keterangan, no_kontrak) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;',
      values: [
        nmJenis, tahun, noProyek, namaProyek, namaRekanan, tglMulai,
        tglAkhir, nilai, nmKota, nmLokasi, keterangan, noKontrak,
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
    text: 'SELECT * FROM data order by id_datum',
  };
  const dataRes = await pool.query(queryGet);
  const data = dataRes.rows;

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  for (let i = 0; i < (data).length; i += 1) {
    data[i].nilai = (Number(data[i].nilai)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    data[i].tgl_mulai = (data[i].tgl_mulai).toLocaleString('id-ID', options);
    data[i].tgl_akhir = (data[i].tgl_akhir).toLocaleString('id-ID', options);

    if (data[i].tgl_selesai) {
      data[i].tgl_selesai = (data[i].tgl_selesai).toLocaleString('id-ID', options);
    }
    if (data[i].tgl_bast1) {
      data[i].tgl_bast1 = (data[i].tgl_bast1).toLocaleString('id-ID', options);
    }
    if (data[i].batas_retensi) {
      data[i].batas_retensi = (data[i].batas_retensi).toLocaleString('id-ID', options);
    }

    Object.keys(data[i]).forEach((key) => {
      if (data[i][key] == null) { data[i][key] = ''; }
    });
  }

  return res.status(200).send({
    status: 'success',
    data,
  });
};

const getDatum = async (req, res) => {
  try {
    const { idDatum } = req.params;

    if (Number.isNaN(Number(idDatum))) {
      throw new InvariantError('Gagal mengambil data. Mohon isi idDatum proyek dengan benar');
    }

    const queryGet = {
      text: 'SELECT * FROM data WHERE id_datum = $1',
      values: [idDatum],
    };
    const poolDatum = await pool.query(queryGet);
    const datum = poolDatum.rows[0];

    if (!(datum)) {
      throw new NotFoundError(`Data dengan id: ${idDatum} tidak ditemukan`);
    }

    datum.nilai = (Number(datum.nilai)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };

    datum.tgl_mulai = (datum.tgl_mulai).toLocaleString('id-ID', options);
    datum.tgl_akhir = (datum.tgl_akhir).toLocaleString('id-ID', options);

    if (datum.tgl_selesai) {
      datum.tgl_selesai = (datum.tgl_selesai).toLocaleString('id-ID', options);
    }
    if (datum.tgl_bast1) {
      datum.tgl_bast1 = (datum.tgl_bast1).toLocaleString('id-ID', options);
    }
    if (datum.batas_retensi) {
      datum.batas_retensi = (datum.batas_retensi).toLocaleString('id-ID', options);
    }

    Object.keys(datum).forEach((key) => {
      if (datum[key] == null) { datum[key] = ''; }
    });

    return res.status(200).send({
      status: 'success',
      data: datum,
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
      message: 'Gagal menghapus data',
    });
  }
};

const editDatum = async (req, res) => {
  try {
    const { idDatum } = req.params;

    if (!idDatum || Number.isNaN(Number(idDatum))) {
      throw new InvariantError('Gagal mengedit data. Mohon isi idDatum proyek dengan benar');
    }

    const {
      nmJenis, tahun, noProyek, namaProyek, namaRekanan, tglMulai, tglAkhir, nilai,
      nmKota, nmLokasi, keterangan, tglSelesai, tglBast1, batasRetensi, noKontrak,
    } = req.body;

    const queryUpdate = {
      text: 'UPDATE data SET nm_jenis = $1, tahun = $2, no_proyek = $3, nm_proyek = $4, nm_rekanan = $5, tgl_mulai = $6, tgl_akhir = $7, nilai = $8, nm_kota = $9, nm_lokasi = $10, keterangan = $11, tgl_selesai = $12, tgl_bast1 = $13, batas_retensi = $14, no_kontrak = $15 WHERE id_datum = $16 RETURNING *;',
      values: [
        nmJenis, tahun, noProyek, namaProyek, namaRekanan, tglMulai, tglAkhir,
        nilai, nmKota, nmLokasi, keterangan, tglSelesai, tglBast1, batasRetensi, noKontrak, idDatum,
      ],
    };
    let poolRes;
    try {
      poolRes = await pool.query(queryUpdate);
    } catch (e) {
      throw new InvariantError(e);
    }
    if (!poolRes.rows[0]) {
      throw new NotFoundError(`Tidak dapat menemukan data ${idDatum}`);
    }
    return res.status(201).send({
      status: 'success',
      message: 'Berhasil mengupdate data',
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
      message: 'Gagal menghapus data',
    });
  }
};

const deleteDatum = async (req, res) => {
  try {
    const { idDatum } = req.params;

    if (!idDatum || Number.isNaN(Number(idDatum))) {
      throw new InvariantError('Gagal menghapus data. Mohon isi idDatum proyek dengan benar');
    }

    const queryDel = {
      text: 'DELETE FROM data WHERE id_datum = $1 RETURNING nm_proyek',
      values: [idDatum],
    };
    const poolDel = await pool.query(queryDel);

    if (!(poolDel.rows[0])) {
      throw new NotFoundError(`Data dengan id: ${idDatum} tidak ditemukan`);
    }

    return res.status(200).send({
      status: 'success',
      message: `Data proyek ${poolDel.rows[0].nm_proyek} berhasil dihapus`,
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
      message: 'Gagal menghapus data',
    });
  }
};

module.exports = {
  getData, addDatum, deleteDatum, getDatum, editDatum,
};
