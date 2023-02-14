const fs = require('fs');
const path = require('path');
const pool = require('../config/db');
const ClientError = require('../exceptions/clientError');
const InvariantError = require('../exceptions/invariantError');
const NotFoundError = require('../exceptions/notFoundError');

const baseUrl = 'http://localhost:3000/';

const resLap = (data) => {
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  const objData = data.map((obj) => (typeof (obj.id) === 'number' ? {
    ...obj,
    file: {
      download: `${baseUrl}download/${obj.file}`,
      preview: `${baseUrl}preview/${obj.file}`,
    },
    created_at: (obj.created_at).toLocaleString('id-ID', options),
  } : obj));

  return objData;
};

const createLaporan = async (req, res) => {
  try {
    const namaFile = req.file.filename;
    const {
      jenisLaporan,
      urutanLap,
      noProyek,
      idUser,
    } = req.body;

    if (jenisLaporan === 'Laporan Harian' || jenisLaporan === 'Laporan Mingguan' || jenisLaporan === 'Laporan Bulanan') {
      if (!urutanLap) {
        throw new InvariantError('urutan laporan wajib diisi');
      }
    }

    const qIdData = {
      text: 'SELECT id_datum, no_proyek FROM data WHERE no_proyek = $1',
      values: [noProyek],
    };
    const resQId = await pool.query(qIdData);
    if (!resQId.rows.length) {
      throw new NotFoundError(`Kontraktor dengan id ${idUser} tidak ditemukan`);
    }

    const createdAt = new Date().toJSON().slice(0, 10);
    const query = {
      text: `INSERT INTO laporan (id, jenis_laporan, urutan_lap, file, created_at, catatan, status, id_datum, id_user) VALUES (DEFAULT, '${jenisLaporan}', '${urutanLap}', '${namaFile}', '${createdAt}', null, 'Ditinjau', '${resQId.rows[0].id_datum}', '${idUser}') RETURNING *;`,
    };
    await pool.query(query);
    return res.status(201).send({
      status: 'success',
      message: 'laporan has been created successfully',
    });
  } catch (e) {
    if (e instanceof ClientError) {
      res.status(e.statusCode).send({
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

const getLaporanByNoProyekKont = async (req, res) => {
  try {
    const { noProyek } = req.params;
    const { pageSize, currentPage, search } = req.query;

    let qFilter;
    if (!search) {
      qFilter = `SELECT l.id, l.jenis_laporan, l.urutan_lap, l.catatan, l.status, d.nm_rekanan, d.no_proyek, d.nm_proyek FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE d.no_proyek = '${noProyek}' ORDER BY LOWER(d.no_proyek) ASC`;
    } else {
      qFilter = `SELECT l.id, l.jenis_laporan, l.urutan_lap, l.catatan, l.status, d.nm_rekanan, d.no_proyek, d.nm_proyek FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE LOWER(l.jenis_laporan) LIKE LOWER('%${search}%') OR LOWER(d.nm_proyek) LIKE LOWER('%${search}%') OR LOWER(nama_vendor) LIKE LOWER('%${search}%') AND d.no_proyek = '${noProyek}' ORDER BY LOWER(d.no_proyek) ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(no_proyek) ASC LIMIT ${pageSize} OFFSET ${offset};`);
      return res.status(200).send({
        status: 'success',
        data: result.rows,
        page: {
          page_size: pageSize,
          total_rows: totalRows.rows[0].count,
          total_pages: totalPages,
          current_page: currentPage,
        },
      });
    }
    result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(no_proyek) ASC;`);

    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const getLaporanDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const query = {
      text: 'SELECT l.id, l.jenis_laporan, l.urutan_lap, d.nm_rekanan, l.catatan, l.status, d.no_proyek, d.nm_proyek FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError(`Admin dengan id ${id} tidak ditemukan`);
    }

    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    if (e instanceof ClientError) {
      res.status(e.statusCode).send({
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

const updateLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      jenisLaporan,
      urutanLap,
    } = req.body;
    const namaFile = req.file.filename;

    const directoryPath = path.join(__dirname, '..', '..', 'resources\\');

    const qFile = {
      text: `SELECT file, status, id FROM laporan WHERE id = ${id}`,
    };
    const resFile = await pool.query(qFile);
    // const qIdData = {
    //   text: 'SELECT id_datum, no_proyek FROM data WHERE no_proyek = $1',
    //   values: [noProyek],
    // };
    // const resQId = await pool.query(qIdData);
    if (resFile.rows[0].status !== 'Revisi') {
      throw new InvariantError('Laporan gagal diperbarui. Status laporan bukan revisi');
    }

    const query = {
      text: `UPDATE laporan SET jenis_laporan = '${jenisLaporan}', urutan_lap = '${urutanLap}', file = '${namaFile}', status = 'Ditinjau' WHERE id = ${id} RETURNING *`,
    };
    await pool.query(query);
    fs.unlink(directoryPath + resFile.rows[0].file, (err) => {
      if (err) {
        throw new NotFoundError('File tidak ditemukan');
      }
      console.log('deleted');
    });
    return res.status(201).send({
      status: 'success',
      message: 'Laporan has been updated successfully',
    });
  } catch (e) {
    if (e instanceof ClientError) {
      res.status(e.statusCode).send({
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

const download = (req, res) => {
  const fileName = req.params.name;
  const directoryPath = path.join(__dirname, '..', '..', 'resources\\');

  res.download(directoryPath + fileName, fileName, (err) => {
    if (err) {
      res.status(500).send({
        status: 'error',
        message: err,
      });
    }
  });
};

const getAllLaporan = async (req, res) => {
  try {
    const { pageSize, currentPage, search } = req.query;

    let qFilter;
    if (!search) {
      qFilter = 'SELECT l.id, l.jenis_laporan, l.urutan_lap, l.catatan, l.status, l.file, l.created_at, d.nm_proyek, d.no_proyek, nm_rekanan FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum  ORDER BY l.created_at ASC';
    } else {
      qFilter = `SELECT l.id, l.jenis_laporan, l.urutan_lap, l.catatan, l.status, l.file, l.created_at, d.nm_proyek, d.no_proyek, nm_rekanan FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE LOWER(l.jenis_laporan) LIKE LOWER('%${search}%') OR LOWER(d.nm_proyek) LIKE LOWER('%${search}%') OR LOWER(d.no_proyek) LIKE LOWER('%${search}%') OR LOWER(l.catatan) LIKE LOWER('%${search}%') OR LOWER(l.status) LIKE LOWER('%${search}%') ORDER BY l.created_at ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY created_at ASC LIMIT ${pageSize} OFFSET ${offset};`);
      const data = result.rows;
      const newRes = resLap(data);

      return res.status(200).send({
        status: 'success',
        data: newRes,
        page: {
          page_size: pageSize,
          total_rows: totalRows.rows[0].count,
          total_pages: totalPages,
          current_page: currentPage,
        },
      });
    }
    result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY created_at ASC;`);
    const data = result.rows;
    const newRes = resLap(data);

    return res.status(200).send({
      status: 'success',
      data: newRes,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const updateStat = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      status,
      catatan,
    } = req.body;

    if (!id || Number.isNaN(Number(id))) {
      throw new InvariantError('Gagal mengupdate status laporan. Mohon isi id dengan benar');
    }

    const query = {
      text: `UPDATE laporan SET status = '${status}', catatan = '${catatan}' WHERE id = ${id} RETURNING *`,
    };
    await pool.query(query);

    res.status(201).send({
      status: 'success',
      message: 'status laporan has been updated!',
    });
  } catch (e) {
    if (e instanceof ClientError) {
      res.status(e.statusCode).send({
        status: 'fail',
        message: e.message,
      });
    }
    res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const deleteLaporan = async (req, res) => {
  try {
    const { id } = req.params;
    const directoryPath = path.join(__dirname, '..', '..', 'resources\\');

    if (!id || Number.isNaN(Number(id))) {
      throw new InvariantError('Gagal menghapus laporan. Mohon isi id laporan dengan benar');
    }

    const qFile = {
      text: 'SELECT file, id FROM laporan WHERE id = $1',
      values: [id],
    };
    const resFile = await pool.query(qFile);
    if (!resFile.rows.length) {
      throw new NotFoundError('Gagal menghapus laporan. Data tidak ditemukan');
    }

    const query = {
      text: 'DELETE FROM laporan WHERE id=$1',
      values: [id],
    };
    await pool.query(query);
    fs.unlink(directoryPath + resFile.rows[0].file, (err) => {
      if (err) {
        throw new NotFoundError('File tidak ditemukan');
      }
      console.log('deleted');
    });

    res.status(201).send({
      status: 'success',
      message: 'laporan laporan has been deleted!',
    });
  } catch (e) {
    if (e instanceof ClientError) {
      res.status(e.statusCode).send({
        status: 'fail',
        message: e.message,
      });
    }
    res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const updateBastStatus = async (req, res) => {
  try {
    const { noProyek } = req.params;
    const { statusBast } = req.body;

    const qUpdateStatus = {
      text: 'UPDATE data SET status_bast1 = $1 WHERE no_proyek = $2 RETURNING *',
      values: [statusBast, noProyek],
    };
    const result = await pool.query(qUpdateStatus);

    if (statusBast === 'Approved') {
      res.status(201).send({
        status: 'success',
        data: {
          statusBast: result.rows[0].status_bast1,
          urlFormBast: 'ini link download bast',
        },
      });
    } else {
      res.status(201).send({
        status: 'success',
        data: {
          statusBast: result.rows[0].status_bast1,
        },
      });
    }
  } catch (e) {
    res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const testingpdf = (req, res) => {
  const fileName = req.params.name;

  fs.readFile(path.join(__dirname, '..', '..', 'resources\\', `${fileName}`), (err, data) => {
    res.contentType('application/pdf');
    res.send(data);
  });
};

module.exports = {
  createLaporan,
  getLaporanByNoProyekKont,
  getLaporanDetail,
  download,
  getAllLaporan,
  updateLaporan,
  updateStat,
  deleteLaporan,
  updateBastStatus,
  testingpdf,
};
