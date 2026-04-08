const express = require('express');
const router = express.Router();

// Tuodaan controller funktiot, sis. logiikka
const { generateOTP, verifyOTP } = require('../controllers/auth_controller');

// Reitit

// -> Käyttäjä syöttää sähköpostin 
// -> backend generoi OTP:n ja lähettää sen sähköpostilla
router.post('/generate-otp', generateOTP);

// -> Käyttäjä syöttää sähköpostin + saamansa 6-numeroisen koodin
// -> backend tarkistaa koodin -> onnistuessa palauttaa onnistumisviestin
router.post('/verify-otp', verifyOTP);

module.exports = router;