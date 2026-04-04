const express = require('express');
const router = express.Router();
const multer = require('multer');

// Tuodaan lataus logiikka
const { uploadFile } = require('../controllers/upload_controller');

const { listFiles, deleteFile } = require('../controllers/upload_controller');

const { authenticateToken } = require('../middleware/auth');

// Käytetään memoryStoragea
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024,     // Maksimi 50 megatavua
  },
  fileFilter: (req, file, cb) => {
    // Tarkistetaan tiedostotyyppi
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4'];    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Vain kuvat ja PDF-tiedostot sallittu'), false);
    }
  }
});

//authenticateToken
router.get('/',authenticateToken, listFiles); // hakee tiedostot

router.post('/',authenticateToken, upload.single('file'), uploadFile); // lataa tiedoston

router.delete('/:id',authenticateToken, deleteFile); // poistaa tiedoston pysyvästi



module.exports = router;
