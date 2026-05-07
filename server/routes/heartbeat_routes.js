const express = require('express');
const router = express.Router();
const Heartbeat = require('../models/heartbeat');
const { authenticateToken } = require('../middleware/auth');

// RPI lähettää tähän — ei vaadi JWT-tokenia
router.post('/ping', async (req, res) => {
  try {
    const { deviceId = 'rpi-infotaulu', syncedFiles = 0 } = req.body;

    await Heartbeat.findOneAndUpdate(
      { deviceId },
      { lastSeen: new Date(), syncedFiles },
      { upsert: true, new: true }
    );

    res.json({ status: 'ok', received: new Date() });
  } catch (err) {
    console.error('Heartbeat error:', err);
    res.status(500).json({ error: 'Heartbeat failed' });
  }
});

// Frontend hakee tästä — vaatii JWT
router.get('/status', authenticateToken, async (req, res) => {
  try {
    const heartbeat = await Heartbeat.findOne({ 
      deviceId: 'rpi-infotaulu' 
    });

    if (!heartbeat) {
      return res.json({ 
        online: false, 
        lastSeen: null,
        syncedFiles: 0
      });
    }

    // Online jos viesti tullut viimeisen 5 minuutin sisään
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
    const online = heartbeat.lastSeen > fiveMinutesAgo;

    res.json({
      online,
      lastSeen: heartbeat.lastSeen,
      syncedFiles: heartbeat.syncedFiles
    });
  } catch (err) {
    res.status(500).json({ error: 'Status check failed' });
  }
});

module.exports = router;