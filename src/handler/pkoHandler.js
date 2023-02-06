const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

const getPko = async (req, res) => {
  const queryGet = {
    text: 'SELECT * FROM monitoring_pr ORDER BY id_monitor',
  };
  const data = await pool.query(queryGet);

  for (let i = 0; i < (data.rows).length; i += 1) {
    data.rows[i].pr_valprice = (Number(data.rows[i].pr_valprice)).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' });
  }
  return res.status(200).send({
    status: 'success',
    data: data.rows,
  });
};

module.exports = {
  getPko,
};
