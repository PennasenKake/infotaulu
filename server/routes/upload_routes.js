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

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'video/mp4', 'application/pdf', 'text/html', 'application/xhtml+xml'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tiedostotyyppi ei ole sallittu'), false);
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
      downloadStream = bucket.openDownloadStream(
        new mongoose.Types.ObjectId(file.filename)
      );
    } catch (idError) {
      console.error('Invalid GridFS ObjectId:', file.filename);
      return res.status(400).json({ error: 'Virheellinen tiedostotunniste' });
    }

    res.set({
      'Content-Type': file.mimeType || 'application/octet-stream',
      'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(file.originalName)}`,
      'Cache-Control': 'no-cache'
    });

    downloadStream.on('error', (err) => {
      console.error('GridFS download stream error:', err);
      if (!res.headersSent) {
        res.status(500).json({ error: 'Virhe tiedoston lukemisessa' });
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


// Levytilan seuranta
router.get('/storage/stats', authenticateToken, async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const stats = await db.stats();

    // MongoDB Atlas free tier — 512 Mt
    const TOTAL_BYTES = 512 * 1024 * 1024;
    const usedBytes = stats.dataSize + stats.indexSize;
    const freeBytes = Math.max(0, TOTAL_BYTES - usedBytes);
    const usedPercent = Math.min(100, Math.round((usedBytes / TOTAL_BYTES) * 100));

    res.json({
      used: usedBytes,
      free: freeBytes,
      total: TOTAL_BYTES,
      usedPercent,
      // Luettava muoto
      usedMB: (usedBytes / 1024 / 1024).toFixed(1),
      totalMB: (TOTAL_BYTES / 1024 / 1024).toFixed(0),
    });
  } catch (err) {
    console.error('Storage stats error:', err);
    res.status(500).json({ error: 'Levytilan haku epäonnistui' });
  }
});


// Vaihda tiedoston tila aktiivinen/piilotettu
router.patch('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const file = await UploadedFile.findById(req.params.id);
    if (!file) return res.status(404).json({ error: 'Tiedostoa ei löytynyt' });

    file.isActive = !file.isActive;
    await file.save();

    res.json({ 
      message: file.isActive ? 'Tiedosto aktivoitu' : 'Tiedosto piilotettu',
      isActive: file.isActive 
    });
  } catch (err) {
    console.error('Toggle error:', err);
    res.status(500).json({ error: 'Tilan vaihto epäonnistui' });
  }
});

router.patch('/:id/display-time', authenticateToken, async (req, res) => {
  try {
    const { displaySeconds } = req.body;

    if (!displaySeconds || displaySeconds < 5 || displaySeconds > 600) {
      return res.status(400).json({ 
        error: 'Esitysajan tulee olla 5–600 sekuntia' 
      });
    }

    const file = await UploadedFile.findByIdAndUpdate(
      req.params.id,
      { displaySeconds: Math.round(displaySeconds) },
      { new: true }
    );

    if (!file) return res.status(404).json({ error: 'Tiedostoa ei löytynyt' });

    res.json({ 
      message: 'Esitysaika päivitetty',
      displaySeconds: file.displaySeconds 
    });
  } catch (err) {
    res.status(500).json({ error: 'Päivitys epäonnistui' });
  }
});

router.patch('/:id/expires', authenticateToken, async (req, res) => {
  try {
    const { expiresAt } = req.body;

    const file = await UploadedFile.findByIdAndUpdate(
      req.params.id,
      { expiresAt: expiresAt ? new Date(expiresAt) : null },
      { new: true }
    );

    if (!file) return res.status(404).json({ error: 'Tiedostoa ei löytynyt' });

    res.json({ 
      message: expiresAt ? 'Voimassaoloaika asetettu' : 'Voimassaoloaika poistettu',
      expiresAt: file.expiresAt 
    });
  } catch (err) {
    res.status(500).json({ error: 'Päivitys epäonnistui' });
  }
});


// Tallenna uusi järjestys
router.patch('/reorder', authenticateToken, async (req, res) => {
  try {
    const { orderedIds } = req.body;

    if (!Array.isArray(orderedIds)) {
      return res.status(400).json({ error: 'orderedIds täytyy olla taulukko' });
    }

    // Päivitä jokaisen tiedoston sortOrder sen indeksin mukaan
    const updates = orderedIds.map((id, index) =>
      UploadedFile.findByIdAndUpdate(id, { sortOrder: index })
    );
    await Promise.all(updates);

    res.json({ message: 'Järjestys tallennettu' });
  } catch (err) {
    console.error('Reorder error:', err);
    res.status(500).json({ error: 'Järjestyksen tallennus epäonnistui' });
  }
});

// Suojatut reitit
router.get('/', authenticateToken, listFiles);
router.post('/', authenticateToken, upload.single('file'), uploadFile);
router.delete('/:id', authenticateToken, deleteFile);

module.exports = router;