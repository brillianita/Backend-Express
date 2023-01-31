const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

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

const getStatistikbyDataStatus = async (req, res) => {
  try {
    const { tahun } = req.query;

    if (!tahun || Number.isNaN(Number(tahun))) {
      throw new InvariantError('Gagal mengambil data. Mohon isi tahun project dengan benar');
    }
    const queryGet = {
      text: "SELECT COUNT(id_datum) as totalProject, COUNT(id_datum) FILTER (WHERE LOWER(status) = 'completed') as completed, COUNT(id_datum) FILTER (WHERE LOWER(status) = 'preparing') as preparing, COUNT(id_datum) FILTER (WHERE LOWER(status) = 'in progress') as inPro, COUNT(id_datum) FILTER (WHERE LOWER(nm_jenis) = 'opex') as opex, COUNT(id_datum) FILTER (WHERE LOWER(nm_jenis) = 'capex') as capex FROM data WHERE tahun = $1;",
      values: [tahun],
    };
    const poolRes = await pool.query(queryGet);
    const data = poolRes.rows[0];

    const {
      totalproject, completed, preparing, inpro,
    } = data;

    data.persenComp = ((completed / totalproject) * 100).toFixed(1);
    data.persenInpro = ((inpro / totalproject) * 100).toFixed(1);
    data.persenprep = ((preparing / totalproject) * 100).toFixed(1);

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
      message: 'Gagal mengambil data',
    });
  }
};

const getStatistikPlanVsActual = async (req, res) => {
  try {
    const { id_datum: idDatum } = req.params;

    if (!idDatum || Number.isNaN(Number(idDatum))) {
      throw new InvariantError('Gagal mengambil data. Masukkan id datum yang benar');
    }

    const queryGet = {
      text: 'SELECT p.arr_value as strplan, r.arr_value as strreal FROM plan as p INNER JOIN real as r ON r.datum_id=p.datum_id where p.datum_id=$1;',
      values: [idDatum],
    };
    const poolRes = await pool.query(queryGet);

    if (!(poolRes.rows[0])) {
      throw new NotFoundError(`Data dengan id: ${idDatum} tidak ditemukan`);
    }

    const {
      strplan: stringPlan, strreal: stringReal,
    } = poolRes.rows[0];

    const arrPlan = JSON.parse(stringPlan);
    const arrReal = JSON.parse(stringReal);
    const totalWeek = Math.max((arrPlan).length, (arrReal).length);

    const arrOfchart = [];

    for (let i = 0; i < totalWeek; i += 1) {
      const chartObj = {};
      chartObj.week = i + 1;
      chartObj.plan = arrPlan[i];
      chartObj.real = arrReal[i];

      if (!chartObj.real) {
        chartObj.real = null;
      }
      if (!chartObj.plan) {
        chartObj.plan = null;
      }

      arrOfchart.push(chartObj);
    }

    return res.status(200).send({
      status: 'success',
      data: {
        idDatum,
        totalWeek,
        arrOfchart,
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
      message: 'Gagal mengambil data',
    });
  }
};

module.exports = {
  getData,
  getStatistikbyDataStatus,
  getStatistikPlanVsActual,
};
