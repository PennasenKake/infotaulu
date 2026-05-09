const mongoose = require('mongoose');

const uploadedFileSchema = new mongoose.Schema({
  filename: { type: String, required: true, unique: true},
  originalName: { type: String, required: true },

  mimeType: { type: String, required: true },
  
  size: { type: Number, required: true},
  
  uploadedBy: { type: String, required: true, index: true },
  
  uploadedAt: { type: Date, default: Date.now},

  displaySeconds: { type: Number, default: 10 },

  isActive:       { type: Boolean, default: true },  

  expiresAt:      { type: Date, default: null } 
});


module.exports = mongoose.model('UploadedFile', uploadedFileSchema);


