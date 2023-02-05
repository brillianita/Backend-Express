const fs = require('fs');
const path = require('path');

const baseUrl = 'http://localhost:3000/laporan/';

const createLaporan = async (req, res) => {
  const namaFile = req.file.filename;
  const {
    jenisLaporan,
    namaProyek,
    namaVendor,
    nomorVkontrak,
  } = req.body;

  if (jenisLaporan.toLowerCase() === '') {
    
  }
};

const getListFiles = (req, res) => {
  const directoryPath = path.join(__dirname, '..', '..', 'resources');

  fs.readdir(directoryPath, (err, files) => {
    if (err) {
      res.status(500).send({
        message: 'Unable to scan files!',
      });
    }

    const fileInfos = [];
    files.forEach((file) => {
      fileInfos.push({
        name: file,
        url: baseUrl + file,
      });
    });
    res.status(200).send(fileInfos);
  });
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

module.exports = {
  createLaporan,
  getListFiles,
  download,
};
