const fs = require('fs');
const path = require('path');
const pool = require('../config/db');

const baseUrl = 'https://nice-cyan-sturgeon-toga.cyclic.app/file/';

const createLaporan = async (req, res) => {
  const namaFile = req.file.filename;
  const {
    jenisLaporan,
    urutanLap,
    noProyek,
    idUser,
  } = req.body;
  try {
    const qIdData = {
      text: 'SELECT id_datum, no_proyek FROM data WHERE no_proyek = $1',
      values: [noProyek],
    };
    const resQId = await pool.query(qIdData);
    const createdAt = new Date().toJSON().slice(0, 10).replace(/-/g, '/');
    const query = {
      text: `INSERT INTO laporan (id, jenis_laporan, urutan_lap, file, created_at, catatan, status, id_datum, id_user) VALUES (DEFAULT, '${jenisLaporan}', '${urutanLap}', '${namaFile}', '${createdAt}', null, 'Ditinjau', '${resQId.rows[0].id_datum}', '${idUser}') RETURNING *;`,
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

const getProyekByIdKontraktor = async (req, res) => {
  const { idUser } = req.params;
  const { pageSize, currentPage, search } = req.query;
  try {
    let qFilter;
    if (!search) {
      qFilter = `SELECT k.id, d.no_proyek, d.nm_proyek, d.nm_rekanan FROM kontraktor_conn AS k INNER JOIN data AS d ON k.id_datum = d.id_datum WHERE k.id_user = '${idUser}' ORDER BY LOWER(d.no_proyek) ASC`;
    } else {
      qFilter = `SELECT k.id, d.no_proyek, d.nm_proyek, d.nm_rekanan FROM kontraktor_conn AS k INNER JOIN data AS d ON k.id_datum = d.id_datum WHERE LOWER(d.no_proyek) LIKE LOWER('%${search}%') OR LOWER(d.nm_proyek) LIKE LOWER('%${search}%') OR LOWER(d.nm_rekanan) LIKE LOWER('%${search}%') AND k.id_user = '${idUser}'  ORDER BY LOWER(d.no_proyek) ASC`;
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
const getLaporanByNoProyekKont = async (req, res) => {
  const { noProyek } = req.params;
  const { pageSize, currentPage, search } = req.query;
  try {
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
      text: 'SELECT l.id, l.jenis_laporan, l.urutan_lap, d.nm_rekanan, l.catatan, l.status, d.no_proyek, d.nm_proyek FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE id = $1',
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
  const {
    jenisLaporan,
    urutanLap,
  } = req.body;
  const namaFile = req.file.filename;
  const directoryPath = path.join(__dirname, '..', '..', 'resources\\');
  try {
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
      return res.status(400).send({
        status: 'fail',
        message: 'Bad Request',
      });
    }
    const query = {
      text: `UPDATE laporan SET jenis_laporan = '${jenisLaporan}', urutan_lap = '${urutanLap}', file = '${namaFile}', status = 'Ditinjau' WHERE id = ${id} RETURNING *`,
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

const getAllProyek = async (req, res) => {
  const { pageSize, currentPage, search } = req.query;
  try {
    let qFilter;
    if (!search) {
      qFilter = 'SELECT k.id, d.no_proyek, d.nm_proyek, d.nm_rekanan FROM kontraktor_conn AS k INNER JOIN data AS d ON k.id_datum = d.id_datum ORDER BY LOWER(d.no_proyek) ASC';
    } else {
      qFilter = `SELECT k.id, d.no_proyek, d.nm_proyek, d.nm_rekanan FROM kontraktor_conn AS k INNER JOIN data AS d ON k.id_datum = d.id_datum WHERE LOWER(d.nm_proyek) LIKE LOWER('%${search}%') OR LOWER(d.no_proyek) LIKE LOWER('%${search}%') OR LOWER(d.nm_rekanan) LIKE LOWER('%${search}%') ORDER BY LOWER(d.no_proyek) ASC`;
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
const getAllLaporan = async (req, res) => {
  const { noProyek } = req.params;
  const { pageSize, currentPage, search } = req.query;
  try {
    let qFilter;
    if (!search) {
      qFilter = `SELECT l.id, l.jenis_laporan, l.urutan_lap, l.catatan, l.status, l.file, l.created_at, d.nm_proyek, d.no_proyek, nm_rekanan FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE d.no_proyek = '${noProyek}' ORDER BY l.created_at ASC`;
    } else {
      qFilter = `SELECT l.id, l.jenis_laporan, l.urutan_lap, l.catatan, l.status, l.file, l.created_at, d.nm_proyek, d.no_proyek, nm_rekanan FROM laporan AS l INNER JOIN data AS d ON l.id_datum = d.id_datum WHERE LOWER(l.jenis_laporan) LIKE LOWER('%${search}%') OR LOWER(d.nm_proyek) LIKE LOWER('%${search}%') OR LOWER(d.no_proyek) LIKE LOWER('%${search}%') OR LOWER(l.catatan) LIKE LOWER('%${search}%') OR LOWER(l.status) LIKE LOWER('%${search}%') AND d.no_proyek = '${noProyek}' ORDER BY l.created_at ASC`;
    }
    let result = await pool.query(qFilter);

    if (pageSize && currentPage) {
      const totalRows = await pool.query(`SELECT COUNT (id) FROM (${qFilter})sub`);
      const totalPages = Math.ceil(totalRows.rows[0].count / pageSize);
      const offset = (currentPage - 1) * pageSize;
      result = await pool.query(`SELECT * FROM (${qFilter})sub ORDER BY created_at ASC LIMIT ${pageSize} OFFSET ${offset};`);
      const data = result.rows;
      const newRes = data.map((obj) => (typeof (obj.id) === 'number' ? { ...obj, file: `${baseUrl}${obj.file}`, created_at: obj.created_at.toJSON().slice(0, 10).replace(/-/g, '/') } : obj));
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
    const newRes = data.map((obj) => (typeof (obj.id) === 'number' ? { ...obj, file: `${baseUrl}${obj.file}`, created_at: obj.created_at.toJSON().slice(0, 10).replace(/-/g, '/') } : obj));
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

const updateStat = async (req, res) => {
  const { id } = req.params;
  const {
    status,
    catatan,
  } = req.body;
  console.log(status);
  try {
    const query = {
      text: `UPDATE laporan SET status = '${status}', catatan = '${catatan}' WHERE id = ${id} RETURNING *`,
    };
    await pool.query(query);

    res.status(201).send({
      status: 'success',
      message: 'status laporan has been updated!',
    });
  } catch (e) {
    res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const deleteLaporan = async (req, res) => {
  const { id } = req.params;
  const directoryPath = path.join(__dirname, '..', '..', 'resources\\');
  try {
    const qFile = {
      text: 'SELECT file, id FROM laporan WHERE id = $1',
      values: [id],
    };
    const resFile = await pool.query(qFile);
    const query = {
      text: 'DELETE FROM laporan WHERE id=$1',
      values: [id],
    };
    await pool.query(query);
    fs.unlink(directoryPath + resFile.rows[0].file, (err) => {
      if (err) {
        console.log('ini error', err);
      }
      console.log('deleted');
    });

    res.status(201).send({
      status: 'success',
      message: 'laporan laporan has been deleted!',
    });
  } catch (e) {
    res.status(500).send({
      status: 'error',
      message: e.message,
    });
  }
};

const updateBastStatus = async (req, res) => {
  const { noProyek } = req.params;
  const { statusBast } = req.body;

  try {
    const qUpdateStatus = {
      text: 'UPDATE data SET status_bast1 = $1 WHERE noProyek = $2 RETURNING *',
      values: [statusBast, noProyek],
    };
    const result = await pool.query(qUpdateStatus);

    if (statusBast === 'Approved') {
      res.status(201).send({
        status: 'success',
        data: {
          statusBast: result.rows[0].status_bast1,
          urlFormBast: 'hddjkdkjdkj',
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

module.exports = {
  createLaporan,
  getProyekByIdKontraktor,
  getLaporanByNoProyekKont,
  getLaporanDetail,
  download,
  getAllProyek,
  getAllLaporan,
  updateLaporan,
  updateStat,
  deleteLaporan,
  updateBastStatus,
};
