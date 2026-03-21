const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  // Sähköpostiosoite, johon OTP on lähetetty
  email: { type: String, required: true, lowercase: true },

  // Itse 6-numeroinen koodi 
  otp: { type: String, required: true },
  
  // Luontiaika 
  createdAt: { type: Date, default: Date.now, expires: '5m' }
});

module.exports = mongoose.model('Otp', otpSchema);