const express = require('express');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Tuodaan controller funktiot, sis. logiikka
const { generateOTP, verifyOTP } = require('../controllers/auth_controller');

// Rate Limiter OTP-pyynnöille (5 kertaa / 10 min)
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,      // 10 minuuttia
  max: 5,                        // max 5 pyyntöä per IP
  standardHeaders: true,         // Näyttää RateLimit-infoa headerissa
  legacyHeaders: false,
  message: {
    error: 'Liian monta OTP-pyyntöä. Odota 10 minuuttia ennen uutta yritystä.'
  }
});

// Reitit
// -> Käyttäjä syöttää sähköpostin 
// -> backend generoi OTP:n ja lähettää sen sähköpostilla
router.post('/generate-otp', generateOTP);

// -> Käyttäjä syöttää sähköpostin + saamansa 6-numeroisen koodin
// -> backend tarkistaa koodin -> onnistuessa palauttaa onnistumisviestin
router.post('/verify-otp', verifyOTP);

module.exports = router;