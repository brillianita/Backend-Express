const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

const resBeautifier = (data) => {
  const dataobj = data;
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  dataobj.nilai_str = (Number(dataobj.nilai)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });

  dataobj.tgl_mulai = (dataobj.tgl_mulai).toLocaleString('id-ID', options);
  dataobj.tgl_akhir = (dataobj.tgl_akhir).toLocaleString('id-ID', options);

  dataobj.status_data = dataobj.status;
  delete dataobj.status;

  if (dataobj.tgl_selesai) {
    dataobj.tgl_selesai = (dataobj.tgl_selesai).toLocaleString('id-ID', options);
  }
  if (dataobj.tgl_bast1) {
    dataobj.tgl_bast1 = (dataobj.tgl_bast1).toLocaleString('id-ID', options);
  }
  if (dataobj.batas_retensi) {
    dataobj.batas_retensi = (dataobj.batas_retensi).toLocaleString('id-ID', options);
  }

  Object.keys(dataobj).forEach((key) => {
    if (dataobj[key] == null) { dataobj[key] = ''; }
  });

  return dataobj;
};

const findLatestActual = async () => {
  const queryGetActual = 'SELECT * FROM real order by id_real';
  const poolActual = await pool.query(queryGetActual);

  const promises = [];

  for (let i = 0; i < (poolActual.rows).length; i += 1) {
    const arrActual = JSON.parse(poolActual.rows[i].arr_value);
    if (arrActual) {
      const lastVal = arrActual[arrActual.length - 1];

      const queryUpdateReal = {
        text: 'UPDATE data SET real = $1 WHERE id_datum = $2',
        values: [lastVal, poolActual.rows[i].datum_id],
      };
      promises.push(pool.query(queryUpdateReal));
      // await pool.query(queryUpdateReal);
    }
  }
  // console.log(promises);

  await Promise.all(promises);
};

const findCurrentPlan = async () => {
  const poolResDate = await pool.query('SELECT id_datum, tgl_mulai FROM data order by id_datum');
  const poolDate = poolResDate.rows;

  const promises = [];

  for (let i = 0; i < poolDate.length; i += 1) {
    const date1 = (poolDate[i].tgl_mulai).getTime();
    const date2 = Date.now();

    let diff = (date2 - date1) / 1000;
    diff /= (60 * 60 * 24 * 7);
    const currentWeek = Math.abs(Math.round(diff));

    // eslint-disable-next-line no-await-in-loop
    const poolResPlan = await pool.query('SELECT * FROM plan WHERE datum_id = $1', [poolDate[i].id_datum]);
    const plan = poolResPlan.rows[0];

    if (plan && (plan.arr_value)) {
      const arrPlan = JSON.parse(plan.arr_value);

      if (arrPlan[currentWeek - 1]) {
        const queryUpdatePlan = {
          text: 'UPDATE data SET plan = $1 WHERE id_datum = $2',
          values: [arrPlan[currentWeek - 1], plan.datum_id],
        };

        promises.push(pool.query(queryUpdatePlan));
      } else {
        const queryUpdatePlan = {
          text: 'UPDATE data SET plan = $1 WHERE id_datum = $2',
          values: [arrPlan[arrPlan.length - 1], plan.datum_id],
        };

        promises.push(pool.query(queryUpdatePlan));
      }
    }
  }
  await Promise.all(promises);
};

const setDeviasiStatus = async () => {
  const promises = [];

  const getPlanReal = await pool.query('SELECT id_datum, plan, real FROM data ORDER BY id_datum');
  const planReal = getPlanReal.rows;

  for (let i = 0; i < planReal.length; i += 1) {
    const deviasi = planReal[i].real - planReal[i].plan;
    // console.log('id_datum: ', planReal[i].id_datum, ' deviasi: ', deviasi);
    let status = '';

    if (planReal[i].real === 100) {
      status = 'COMPLETED';
    } else if (planReal[i].real > 0 && planReal[i].real < 100) {
      status = 'IN PROGRESS';
    } else if (planReal[i].real === 0 || planReal[i].real === null) {
      status = 'PREPARING';
    } else {
      status = 'ERROR';
    }

    const queryUpdateStatusDeviasi = {
      text: 'UPDATE data SET deviasi = $1, status = $2 WHERE id_datum = $3',
      values: [deviasi, status, planReal[i].id_datum],
    };
    promises.push(pool.query(queryUpdateStatusDeviasi));
  }
  await Promise.all(promises);
};

const setProgress = async () => {
  const promises = [];
  const queryGetProgress = {
    text: 'SELECT id_datum, plan, real, status FROM data WHERE LOWER(status) = $1 ORDER BY id_datum',
    values: ['in progress'],
  };
  const poolProgress = await pool.query(queryGetProgress);
  const progress = poolProgress.rows;
  let statusProgress;

  for (let i = 0; i < progress.length; i += 1) {
    if (progress[i].plan === progress[i].real) {
      statusProgress = 'ON TRACK';
    } else if (progress[i].plan > progress[i].real) {
      statusProgress = 'LATE';
    } else if (progress[i].plan < progress[i].real) {
      statusProgress = 'LEADING';
    }

    const queryUpdateProgress = {
      text: 'UPDATE data SET progress = $1 WHERE id_datum = $2',
      values: [statusProgress, progress[i].id_datum],
    };
    promises.push(pool.query(queryUpdateProgress));
  }
  await Promise.all(promises);
};

const getData = async (req, res) => {
  await findLatestActual();
  await findCurrentPlan();
  await setDeviasiStatus();
  await setProgress();

  // Pemanggilan Get
  const queryGet = {
    text: 'SELECT * FROM data order by id_datum',
  };
  const dataRes = await pool.query(queryGet);
  const data = dataRes.rows;

  for (let i = 0; i < (data).length; i += 1) {
    data[i] = resBeautifier(data[i]);
  }

  return res.status(200).send({
    status: 'success',
    data,
  });
};

const addDatum = async (req, res) => {
  try {
    const {
      nmJenis, tahun, noProyek, namaProyek, namaRekanan,
      tglMulai, tglAkhir, nilai, nmKota, nmLokasi, keterangan, klasifikasi, arrPlan,
    } = req.body;

    if (typeof (arrPlan) !== 'object') {
      throw new InvariantError('Masukkan array arrPlan dengan benar!');
    }

    const queryInsert = {
      text: 'INSERT INTO data (id_datum, nm_jenis, tahun, no_proyek, nm_proyek, nm_rekanan, tgl_mulai, tgl_akhir, nilai, nm_kota, nm_lokasi, keterangan, klasifikasi) VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *;',
      values: [
        nmJenis, tahun, noProyek, namaProyek, namaRekanan, tglMulai,
        tglAkhir, nilai, nmKota, nmLokasi, keterangan, klasifikasi,
      ],
    };

    let poolRes;

    try {
      poolRes = await pool.query(queryInsert);
      poolRes.rows[0] = resBeautifier(poolRes.rows[0]);
    } catch (e) {
      throw new InvariantError(e);
    }

    const arrPlanStr = `[${arrPlan}]`;

    const queryInsertPlan = {
      text: 'INSERT INTO plan (datum_id, arr_value) VALUES ($1, $2) RETURNING *;',
      values: [
        poolRes.rows[0].id_datum, arrPlanStr,
      ],
    };

    try {
      const poolResPlan = await pool.query(queryInsertPlan);
      poolRes.rows[0].arrplan = poolResPlan.rows[0].arr_value;
      if (poolRes.rows[0].arrplan) {
        poolRes.rows[0].arrplan = JSON.parse(poolRes.rows[0].arrplan);
      }
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
    // const datum = poolDatum.rows[0];

    if (!(poolDatum.rows[0])) {
      throw new NotFoundError(`Data dengan id: ${idDatum} tidak ditemukan`);
    }

    poolDatum.rows[0] = resBeautifier(poolDatum.rows[0]);

    return res.status(200).send({
      status: 'success',
      data: poolDatum.rows[0],
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
      nmKota, nmLokasi, keterangan, tglSelesai, tglBast1, batasRetensi, klasifikasi,
    } = req.body;

    const queryUpdate = {
      text: 'UPDATE data SET nm_jenis = $1, tahun = $2, no_proyek = $3, nm_proyek = $4, nm_rekanan = $5, tgl_mulai = $6, tgl_akhir = $7, nilai = $8, nm_kota = $9, nm_lokasi = $10, keterangan = $11, tgl_selesai = $12, tgl_bast1 = $13, batas_retensi = $14, klasifikasi = $15 WHERE id_datum = $16 RETURNING *;',
      values: [
        nmJenis, tahun, noProyek, namaProyek, namaRekanan, tglMulai, tglAkhir, nilai,
        nmKota, nmLokasi, keterangan, tglSelesai, tglBast1, batasRetensi, klasifikasi, idDatum,
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
    poolRes.rows[0] = resBeautifier(poolRes.rows[0]);

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
