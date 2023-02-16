const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

const addPlan = async (req, res) => {
  try {
    const { idDatum, arrPlan } = req.body;

    if (typeof (arrPlan) !== 'object') {
      throw new InvariantError('Masukkan array arrPlan dengan benar!');
    }
    const arrPlanStr = `[${arrPlan}]`;

    const queryInsert = {
      text: 'INSERT INTO plan (datum_id, arr_value) VALUES ($1, $2) RETURNING *;',
      values: [
        idDatum, arrPlanStr,
      ],
    };

    let poolRes;

    try {
      poolRes = await pool.query(queryInsert);
      // poolRes.rows[0] = resBeautifier(poolRes.rows[0]);
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

const getPlan = async (req, res) => {
  const queryGet = {
    text: 'SELECT * FROM plan order by id_plan',
  };
  const dataRes = await pool.query(queryGet);
  const data = dataRes.rows;

  for (let i = 0; i < data.length; i += 1) {
    if (data[i].arr_value) {
      data[i].arr_value = JSON.parse(data[i].arr_value);
    }
  }

  return res.status(200).send({
    status: 'success',
    data,
  });
};

const getPlanDetail = async (req, res) => {
  try {
    const { idDatum } = req.params;
    const queryGet = {
      text: 'SELECT * FROM plan WHERE datum_id = $1 order by id_plan',
      values: [idDatum],
    };
    const dataRes = await pool.query(queryGet);
    const data = dataRes.rows;

    if (!(data.length)) {
      throw new InvariantError('Tidak ada data plan pada proyek tersebut');
    }

    if (data[0].arr_value) {
      data[0].arr_value = JSON.parse(data[0].arr_value);
    }

    return res.status(200).send({
      status: 'success',
      data,
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

const editPlanDetail = async (req, res) => {
  try {
    const { idDatum } = req.params;
    const { arrPlan } = req.body;

    if (typeof (arrPlan) !== 'object') {
      throw new InvariantError('Masukkan array arrPlan dengan benar!');
    }
    const arrPlanStr = `[${arrPlan}]`;

    const queryUpdate = {
      text: 'UPDATE plan SET arr_value = $1 WHERE datum_id = $2 RETURNING *;',
      values: [arrPlanStr, idDatum],
    };

    let poolRes;

    try {
      poolRes = await pool.query(queryUpdate);
    } catch (e) {
      throw new InvariantError(e);
    }

    return res.status(201).send({
      status: 'success',
      message: 'Berhasil mengedit data plan',
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

const deletePlan = async (req, res) => {
  try {
    const { idDatum } = req.params;

    if (!idDatum || Number.isNaN(Number(idDatum))) {
      throw new InvariantError('Gagal menghapus data plan. Mohon isi idDatum proyek dengan benar');
    }

    const queryDel = {
      text: 'DELETE FROM plan WHERE datum_id = $1 RETURNING *',
      values: [idDatum],
    };
    const poolDel = await pool.query(queryDel);

    if (!(poolDel.rows[0])) {
      throw new NotFoundError(`Data dengan id: ${idDatum} tidak ditemukan`);
    }

    return res.status(200).send({
      status: 'success',
      message: `Data proyek ${poolDel.rows[0].datum_id} berhasil dihapus`,
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
      message: 'Gagal menghapus data plan',
    });
  }
};

const addActual = async (req, res) => {
  try {
    const { idDatum, arrActual } = req.body;

    if (typeof (arrActual) !== 'object') {
      throw new InvariantError('Masukkan array arrActual dengan benar!');
    }
    const arrActualStr = `[${arrActual}]`;

    const queryInsert = {
      text: 'INSERT INTO real (datum_id, arr_value) VALUES ($1, $2) RETURNING *;',
      values: [idDatum, arrActualStr],
    };
    const queryUpdate = {
      text: 'UPDATE real SET arr_value = $1 WHERE datum_id = $2 RETURNING *;',
      values: [arrActualStr, idDatum],
    };

    let poolRes;

    try {
      const queryGetCheck = {
        text: 'SELECT * FROM real WHERE datum_id = $1',
        values: [idDatum],
      };
      const poolGet = await pool.query(queryGetCheck);

      if (!poolGet.rows[0]) {
        poolRes = await pool.query(queryInsert);
      } else {
        poolRes = await pool.query(queryUpdate);
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

const getActual = async (req, res) => {
  const queryGet = {
    text: 'SELECT * FROM real order by id_real',
  };
  const dataRes = await pool.query(queryGet);
  const data = dataRes.rows;

  for (let i = 0; i < data.length; i += 1) {
    if (data[i].arr_value) {
      data[i].arr_value = JSON.parse(data[i].arr_value);
    }
  }

  return res.status(200).send({
    status: 'success',
    data,
  });
};

const getActualDetail = async (req, res) => {
  try {
    const { idDatum } = req.params;

    const queryGet = {
      text: 'SELECT * FROM real WHERE datum_id = $1 order by id_real',
      values: [idDatum],
    };
    const dataRes = await pool.query(queryGet);
    const data = dataRes.rows;
    console.log(data);

    if (!(data.length)) {
      throw new InvariantError('Tidak ada data actual pada proyek tersebut');
    }
    if (data[0].arr_value) {
      data[0].arr_value = JSON.parse(data[0].arr_value);
    }

    return res.status(200).send({
      status: 'success',
      data,
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

const editActualDetail = async (req, res) => {
  try {
    const { idDatum } = req.params;
    const { arrActual } = req.body;

    if (typeof (arrActual) !== 'object') {
      throw new InvariantError('Masukkan array arrActual dengan benar!');
    }
    const arrActualStr = `[${arrActual}]`;

    const queryUpdate = {
      text: 'UPDATE real SET arr_value = $1 WHERE datum_id = $2 RETURNING *;',
      values: [arrActualStr, idDatum],
    };

    let poolRes;

    try {
      poolRes = await pool.query(queryUpdate);
    } catch (e) {
      throw new InvariantError(e);
    }

    return res.status(201).send({
      status: 'success',
      message: 'Berhasil mengedit data actual',
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

const deleteActual = async (req, res) => {
  try {
    const { idDatum } = req.params;

    if (!idDatum || Number.isNaN(Number(idDatum))) {
      throw new InvariantError('Gagal menghapus data actual. Mohon isi idDatum proyek dengan benar');
    }

    const queryDel = {
      text: 'DELETE FROM real WHERE datum_id = $1 RETURNING *',
      values: [idDatum],
    };
    const poolDel = await pool.query(queryDel);

    if (!(poolDel.rows[0])) {
      throw new NotFoundError(`Data dengan id: ${idDatum} tidak ditemukan`);
    }

    return res.status(200).send({
      status: 'success',
      message: `Data actual ${poolDel.rows[0].datum_id} berhasil dihapus`,
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
      message: 'Gagal menghapus data actual',
    });
  }
};

const getPlanActual = async (req, res) => {
  try {
    const queryGet = {
      text: 'SELECT d.nm_proyek, d.tahun, p.datum_id, p.arr_value AS arrplan, r.arr_value as arractual FROM plan AS p LEFT JOIN real AS r ON p.datum_id = r.datum_id INNER JOIN data AS d ON p.datum_id = d.id_datum ORDER BY p.datum_id',
    };
    const dataRes = await pool.query(queryGet);
    const data = dataRes.rows;

    for (let i = 0; i < data.length; i += 1) {
      if (data[i].arrplan) {
        data[i].arrplan = JSON.parse(data[i].arrplan);
      }
      if (data[i].arractual) {
        data[i].arractual = JSON.parse(data[i].arractual);
      }
    }
    return res.status(200).send({
      status: 'success',
      data,
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

module.exports = {
  addPlan,
  getPlan,
  getPlanDetail,
  deletePlan,
  editPlanDetail,
  addActual,
  getActual,
  getActualDetail,
  editActualDetail,
  deleteActual,
  getPlanActual,
};
