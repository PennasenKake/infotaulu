const express = require('express');
const router = express.Router();
const multer = require('multer');

const { uploadFile, listFiles, deleteFile } = require('../controllers/upload_controller');
const { authenticateToken } = require('../middleware/auth');

const UploadedFile = require('../models/uploadedFile');           
const { getGridFSBucket } = require('../config/db'); 

// Multer asetukset
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 Mt
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4' , 'application/pdf' ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Vain JPG, PNG, PDF ja MP4-tiedostot ovat sallittuja'), false);
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

    if (!file.filename) {
      return res.status(400).json({ error: 'Tiedostolla ei ole GridFS-tunnistetta' });
    }

    const bucket = getGridFSBucket();

    let downloadStream;
    try {
      // Varmistetaan että filename on kelvollinen ObjectId
      const gridfsId = new mongoose.Types.ObjectId(file.filename);
      downloadStream = bucket.openDownloadStream(gridfsId);
    } catch (idError) {
      console.error('Invalid GridFS filename:', file.filename, idError);
      return res.status(400).json({ 
        error: 'Virheellinen GridFS-tunniste tiedostossa',
        filename: file.filename 
      });
    }

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename="${encodeURIComponent(file.originalName)}"`,
      'Cache-Control': 'no-cache'
    });

    downloadStream.on('error', (err) => {
      console.error('GridFS download error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Virhe tiedoston lukemisessa GridFS:stä' });
      }
    });

    downloadStream.pipe(res);

  } catch (err) {
    console.error('Download route error:', err);
    if (!res.headersSent) {
      res.status(500).json({ error: 'Virhe tiedoston lataamisessa' });
    }
  }
});

// Suojatut reitit
router.get('/', authenticateToken, listFiles);
router.post('/', authenticateToken, upload.single('file'), uploadFile);
router.delete('/:id', authenticateToken, deleteFile);

module.exports = router;