const express = require('express');
const router = express.Router();
const multer = require('multer');
const mongoose = require('mongoose');

const { uploadFile, listFiles, deleteFile } = require('../controllers/upload_controller');
const { authenticateToken } = require('../middleware/auth');
const UploadedFile = require('../models/uploadedFile');        
const { getGridFSBucket } = require('../config/db');           

// Multer asetukset
const storage = multer.memoryStorage();

const upload = multer({ fileSize: 50 * 1024 * 1024 }, // 50 Mt
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, 
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Vain JPG, PNG, MP4 ja PDF-tiedostot ovat sallittuja'), false);
    }
  }
});

// Download-reitti
router.get('/download/:id', authenticateToken, async (req, res) => {
  try {
    const file = await UploadedFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ error: 'Tiedostoa ei löytynyt' });
    }

    const bucket = getGridFSBucket();
    const downloadStream = bucket.openDownloadStream(
      new mongoose.Types.ObjectId(file.filename)
    );

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Cache-Control': 'no-cache'
    });

    downloadStream.pipe(res);
  } catch (err) {
    console.error('Download error:', err);
    res.status(500).json({ error: 'Virhe tiedoston lataamisessa' });
  }
});

// Muut reitit
router.get('/', authenticateToken, listFiles);
router.post('/', authenticateToken, upload.single('file'), uploadFile);
router.delete('/:id', authenticateToken, deleteFile);

module.exports = router;