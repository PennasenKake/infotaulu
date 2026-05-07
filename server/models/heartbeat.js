const mongoose = require('mongoose');

const heartbeatSchema = new mongoose.Schema({
  deviceId: { 
    type: String, 
    default: 'rpi-infotaulu' 
  },
  lastSeen: { 
    type: Date, 
    default: Date.now 
  },
  syncedFiles: { 
    type: Number, 
    default: 0 
  }
});

module.exports = mongoose.model('Heartbeat', heartbeatSchema);