const multer = require('multer');
const path = require('path');

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, "./src/data/");
    cb(null, path.join(__dirname, '/tmp/resources'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-test-${file.originalname}`);
  },
});

const upload = multer({ storage: fileStorageEngine });

module.exports = {
  upload,
};
