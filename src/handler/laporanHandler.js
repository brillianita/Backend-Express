const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

// const baseUrl = 'http://localhost:3000/laporan/';

const createLaporan = async (req, res) => {
  const namaFile = req.file.filename;
  const {
    jenisLaporan,
    urutanLap,
    namaProyek,
    namaVendor,
    nomorKontrak,
  } = req.body;
  try {
    const createdAt = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const query = {
      text: `INSERT INTO laporan (id, jenis_laporan, urutan_lap, nama_proyek, nama_vendor, file, nomor_kontrak, created_at, catatan, status) VALUES (DEFAULT, '${jenisLaporan}', '${urutanLap}', '${namaProyek}', '${namaVendor}', '${namaFile}', '${nomorKontrak}', '${createdAt}', 'Revisi', 'Ditinjau') RETURNING *;`,
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

const getLaporan = async (req, res) => {
  const { nomorKontrak } = req.params;
  const { pageSize, currentPage, search } = req.query;
  try {
    let qFilter;
    if (!search) {
      qFilter = `SELECT id, jenis_laporan, urutan_lap, created_at, nama_proyek, nama_vendor, nomor_kontrak, catatan, status FROM laporan WHERE nomor_kontrak = '${nomorKontrak}' ORDER BY LOWER(nama_proyek) ASC`;
    } else {
      qFilter = `SELECT id, jenis_laporan, created_at, nama_proyek, nama_vendor, nomor_kontrak, catatan, status FROM laporan WHERE nomor_kontrak = '${nomorKontrak}' AND LOWER(jenis_laporan) LIKE LOWER('%${search}%') OR LOWER(nama_proyek) LIKE LOWER('%${search}%') OR LOWER(nama_vendor) LIKE LOWER('%${search}%') ORDER BY LOWER(nama_proyek) ASC`;
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
    const result = await pool.query(query);
    fs.unlink(directoryPath + resFile.rows[0].file, (err) => {
      if (err) {
        console.log('ini error', err);
      }
      console.log('deleted');
    });
    return res.status(201).send({
      status: 'success',
      data: result.rows[0],
    });
  } catch (e) {
    return res.status(500).send({
      status: 'fail',
      message: e.message,
    });
  }
};

module.exports = {
  createLaporan,
  getLaporan,
  getLaporanDetail,
  download,
  updateLaporan,
};
