const otpGenerator = require('otp-generator');
const { Resend } = require('resend');     // Resend SDK
const Otp = require('../models/otp');     // Mongoose-malli otp-tietueille
const { isEmailWhitelisted } = require('../utils/whitelist'); // Sallittujen sähköpostien tarkistus
const jwt = require('jsonwebtoken');

// Alusta Resend kerran moduulin alussa (käyttää ympäristömuuttujaa)
const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = async (req, res) => {
  const { email } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const aika = new Date().toISOString();

  // Validointi
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    console.log(`[OTP] HYLÄTTY — virheellinen sähköposti | IP: ${ip} | ${aika}`);
    return res.status(400).json({ error: 'Kelvollinen sähköposti vaaditaan' });
  }

  // Tarkistetaan, onko sähköpostiosoite sallittu
  if (!isEmailWhitelisted(email)) {
    console.log(`[OTP] ESTETTY — ei whitelistalla: ${email} | IP: ${ip} | ${aika}`);
    return res.status(403).json({ error: 'Sähköpostiosoitteesi ei ole sallittu' });
  }

  try {
    // Generoidaan koodi
    const otp = otpGenerator.generate(6, {
      digits: true,
      upperCaseAlphabets: false,
      lowerCaseAlphabets: false,
      specialChars: false,
    });

    // Poistetaan vanhat koodit
    await Otp.deleteMany({ email });
    // Tallennetaan uusi otp tietokantaan
    await Otp.create({ email, otp });

    //  Lähetä sähköposti Resendillä (HTTPS API, ei SMTP:ää)
    await resend.emails.send({
      from: 'Infotaulu <onboarding@sprinfotaulu.fi>',   // 
      to: email,
      replyTo: 'no-reply@noreply.com',              // Estää turhat vastaukset 
      subject: 'Kertakäyttökoodi infotaululle',
      text: `Hei!\n\nKäytä tätä koodia: ${otp}\n\nKoodi vanhenee 5 minuutissa.\n\nÄLÄ VASTAA TÄHÄN VIESTIIN.`,
      html: `
        <p>Hei!</p>
        <p><b>Käytä tätä koodia:</b> <big>${otp}</big></p>
        <p>Koodi vanhenee 5 minuutissa.</p>
        <hr style="border:0; border-top:1px solid #eee; margin:20px 0;">
        <p style="color:#666; font-size:0.9em;">
          Älä vastaa tähän viestiin – se on automaattisesti lähetetty.
        </p>
      `,
    });
    console.log(`[OTP] LÄHETETTY — ${email} | IP: ${ip} | ${aika}`);
    return res.json({ message: 'Kertakäyttökoodi lähetetty onnistuneesti' });
  } catch (err) {
    console.error(`[OTP] VIRHE — ${email} | IP: ${ip} | ${aika} | ${err.message}`);
    console.error('generate-otp error:', err);
    return res.status(500).json({ error: 'OTP:n lähetys epäonnistui' });
  }
};

// Varmistaa OTP:n oikeellisuuden N
const verifyOTP = async (req, res) => {
  let { email, otp } = req.body;
  // Normalisointi
  email = email?.trim().toLowerCase();
  otp = otp?.trim();
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const aika = new Date().toISOString();

  if (!email || !otp) {
    return res.status(400).json({ error: 'Puuttuvat tiedot' });
  }

  try {
    // Etsitään täsmäävä otp tietue
    const record = await Otp.findOne({ email, otp });

    if (!record) {
      // Tärkeä: kirjaa epäonnistuneet kirjautumisyritykset
      console.log(`[AUTH] EPÄONNISTUI — väärä/vanhentunut koodi: ${email} | IP: ${ip} | ${aika}`);
      return res.status(400).json({ error: 'Virheellinen tai vanhentunut koodi' });
    }

    // Poistetaan koodi tietokannasta käytön jälkeen
    await Otp.deleteOne({ _id: record._id });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });
    console.log(`[AUTH] ONNISTUI — kirjautuminen: ${email} | IP: ${ip} | ${aika}`);
    return res.json({ message: 'Koodi hyväksytty', success: true, token: token });
  } catch (err) {
    console.error(`[AUTH] VIRHE — ${email} | IP: ${ip} | ${aika} | ${err.message}`);
    console.error('verify-otp error:', err);
    return res.status(500).json({ error: 'Palvelinvirhe' });
  }
};

module.exports = { generateOTP, verifyOTP };