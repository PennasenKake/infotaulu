const express = require('express');
const router = express.Router();
const multer = require('multer');

const { uploadFile, listFiles, deleteFile } = require('../controllers/upload_controller');
const { authenticate } = require('../middleware/auth');

// Multer asetukset
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 Mt
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Vain JPG, PNG ja MP4-tiedostot ovat sallittuja'), false);
    }
  }
});

// Suojatut reitit
router.get('/', authenticate, listFiles);
router.post('/', authenticate, upload.single('file'), uploadFile);
router.delete('/:id', authenticate, deleteFile);

module.exports = router;