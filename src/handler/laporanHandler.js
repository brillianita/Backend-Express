const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const baseUrl = 'http://localhost:3000/file/';

const createLaporan = async (req, res) => {
  const namaFile = req.file.filename;
  const {
    jenisLaporan,
    urutanLap,
    noProyek,
    namaVendor,
  } = req.body;
  try {
    const qIdData = {
      text: 'SELECT id_datum, no_proyek FROM data WHERE no_proyek = $1',
      values: [noProyek],
    };
    const resQId = await pool.query(qIdData);
    const createdAt = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const query = {
      text: `INSERT INTO laporan (id, jenis_laporan, urutan_lap, nama_vendor, file, created_at, catatan, status, id_datum) VALUES (DEFAULT, '${jenisLaporan}', '${urutanLap}', '${namaVendor}', '${namaFile}', '${createdAt}', 'Revisi', 'Ditinjau', '${resQId.rows[0].id_datum}') RETURNING *;`,
    };
    await pool.query(query);
    return res.status(201).send({
      status: 'success',
      message: 'laporan has been created successfully',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'fail',
      message: e.message,
    });
  }
};

const getNoProyek = async (req, res) => {
  const { noKontrak } = req.query;
  try {
    const query = {
      text: 'SELECT no_proyek, no_kontrak FROM data WHERE no_kontrak = $1',
      values: [noKontrak],
    };
    const result = await pool.query(query);

    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      data: e.message,
    });
  }
};

const getNamaProyek = async (req, res) => {
  const { noProyek, noKontrak } = req.query;
  try {
    const query = {
      text: 'SELECT nm_proyek, no_proyek, no_kontrak FROM data WHERE no_proyek = $1 AND no_kontrak = $2',
      values: [noProyek, noKontrak],
    };
    const result = await pool.query(query);

    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      data: e.message,
    });
  }
};

const getLaporan = async (req, res) => {
  const { nomorKontrak } = req.params;
  const { pageSize, currentPage, search } = req.query;
  try {
    let qFilter;
    if (!search) {
      qFilter = `SELECT l.id, l.jenis_laporan, l.urutan_lap, l.created_at, l.nama_vendor, l.catatan, l.status, l.id_datum, d.nm_proyek FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE d.no_kontrak = '${nomorKontrak}' ORDER BY LOWER(d.nm_proyek) ASC`;
    } else {
      qFilter = `SELECT l.id, l.jenis_laporan, l.urutan_lap, l.created_at, l.nama_vendor, l.catatan, l.status, l.id_datum, d.nm_proyek FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE d.no_kontrak = '${nomorKontrak}' AND LOWER(l.jenis_laporan) LIKE LOWER('%${search}%') OR LOWER(d.nm_proyek) LIKE LOWER('%${search}%') OR LOWER(nama_vendor) LIKE LOWER('%${search}%') ORDER BY LOWER(d.nm_proyek) ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nm_proyek) ASC LIMIT ${pageSize} OFFSET ${offset};`);
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
    result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nm_proyek) ASC;`);

    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      // message: "Sorry there was a failure on our server."
      message: e.message,
    });
  }
  //   const directoryPath = path.join(__dirname, '..', '..', 'resources');
  //   fs.readdir(directoryPath, (err, files) => {
  //     if (err) {
  //       res.status(500).send({
  //         message: 'Unable to scan files!',
  //       });
  //     }
  //     const fileInfos = [];
  //     files.forEach((file) => {
  //       fileInfos.push({
  //         name: file,
  //         url: baseUrl + file,
  //       });
  //     });
  //     res.status(200).send(fileInfos);
  //   });
  // } catch (e) {
  //   res.status(500).send({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
};

const getLaporanDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const query = {
      text: 'SELECT id, jenis_laporan, urutan_lap, created_at, nama_proyek, nama_vendor, nomor_kontrak, catatan, status FROM laporan WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      // message: "Sorry there was a failure on our server."
      message: e.message,
    });
  }
};

const updateLaporan = async (req, res) => {
  const { id } = req.params;
  const { jenisLaporan, namaProyek, namaVendor } = req.body;
  const namaFile = req.file.filename;
  const directoryPath = path.join(__dirname, '..', '..', 'resources\\');
  try {
    const qFile = {
      text: `SELECT file FROM laporan WHERE id = ${id}`,
    };
    const resFile = await pool.query(qFile);
    const query = {
      text: `UPDATE laporan SET jenis_laporan = '${jenisLaporan}', nama_proyek = '${namaProyek}', nama_vendor = '${namaVendor}', file = '${namaFile}' WHERE id = ${id} RETURNING *`,
    };
    await pool.query(query);
    fs.unlink(directoryPath + resFile.rows[0].file, (err) => {
      if (err) {
        console.log('ini error', err);
      }
      console.log('deleted');
    });
    return res.status(201).send({
      status: 'success',
      message: 'Laporan has been updated successfully',
    });
  } catch (e) {
    return res.status(500).send({
      status: 'fail',
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
        message: `Could not download the file. ${err}`,
      });
    }
  });
};

const getLaporanStaff = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;
  try {
    let qFilter;
    if (!search) {
      qFilter = 'SELECT id, jenis_laporan, urutan_lap, created_at, file, nama_proyek, nama_vendor, nomor_kontrak, catatan, status FROM laporan ORDER BY LOWER(nama_proyek) ASC';
    } else {
      qFilter = `SELECT id, jenis_laporan, created_at, file, nama_proyek, nama_vendor, nomor_kontrak, catatan, status FROM laporan WHERE LOWER(jenis_laporan) LIKE LOWER('%${search}%') OR LOWER(nama_proyek) LIKE LOWER('%${search}%') OR LOWER(nama_vendor) LIKE LOWER('%${search}%') ORDER BY LOWER(nama_proyek) ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nama_proyek) ASC LIMIT ${pageSize} OFFSET ${offset};`);
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
    result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY LOWER(nama_proyek) ASC;`);
    const data = result.rows;
    const newRes = data.map((obj) => (typeof (obj.id) === 'number' ? { ...obj, file: `${baseUrl}${obj.file}` } : obj));
    return res.status(200).send({
      status: 'success',
      data: newRes,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      // message: "Sorry there was a failure on our server."
      message: e.message,
    });
  }
  //   const directoryPath = path.join(__dirname, '..', '..', 'resources');
  //   fs.readdir(directoryPath, (err, files) => {
  //     if (err) {
  //       res.status(500).send({
  //         message: 'Unable to scan files!',
  //       });
  //     }
  //     const fileInfos = [];
  //     files.forEach((file) => {
  //       fileInfos.push({
  //         name: file,
  //         url: baseUrl + file,
  //       });
  //     });
  //     res.status(200).send(fileInfos);
  //   });
  // } catch (e) {
  //   res.status(500).send({
  //     status: 'fail',
  //     message: e.message,
  //   });
  // }
};

const getLaporanDetailStaff = async (req, res) => {
  const { id } = req.params;
  try {
    const query = {
      text: 'SELECT id, jenis_laporan, urutan_lap, created_at, nama_proyek, nama_vendor, nomor_kontrak, catatan, status FROM laporan WHERE id = $1',
      values: [id],
    };
    const result = await pool.query(query);
    return res.status(200).send({
      status: 'success',
      data: result.rows,
    });
  } catch (e) {
    return res.status(500).send({
      status: 'error',
      // message: "Sorry there was a failure on our server."
      message: e.message,
    });
  }
};
module.exports = {
  getNamaProyek,
  getNoProyek,
  createLaporan,
  getLaporan,
  getLaporanDetail,
  download,
  getLaporanDetailStaff,
  getLaporanStaff,
  updateLaporan,
};
