const multer = require('multer');
const path = require('path');
const os = require('os');
const config = require('../config/env');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, os.tmpdir());
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'img-val-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error('Invalid file type. Only JPEG, PNG and WEBP are allowed.');
    err.statusCode = 400;
    cb(err, false);
  }
};

const upload = multer({ 
  storage,
  limits: {
    fileSize: config.MAX_FILE_SIZE_MB * 1024 * 1024
  },
  fileFilter
});

module.exports = upload;
