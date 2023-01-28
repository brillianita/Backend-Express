const pool = require('../config/db');

const getData = async(req, res) => {
  const queryGet = {
    text : 'SELECT * FROM data',
  }
  const data = await pool.query(queryGet);
  console.log(data.rows);

  return res.status(200).send({
    status: 'success',
    data: data.rows,
  });
}

module.exports = { 
  getData,
};