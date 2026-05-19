const express = require('express');
const router = express.Router();
const uploadMiddleware = require('../middlewares/uploadMiddleware');
const imageController = require('../controllers/imageController');

// POST /api/images/validate
router.post(
  '/validate',
  uploadMiddleware.single('image'),
  imageController.validateImage
);

module.exports = router;
