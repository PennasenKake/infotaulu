const isEmailWhitelisted = (email) => {
  if (!email) return false;
  //  Normalisoidaan sähköposti vertailua varten
  const normalized = email.toLowerCase().trim();
  // Haetaan whitelist .env-tiedostosta
  const whitelistStr = process.env.ALLOWED_OTP_EMAILS || '';
  // Muutetaan merkkijono taulukoksi ja siivotaan
  const allowed = whitelistStr.split(',').map(e => e.trim().toLowerCase()).filter(Boolean);
  // Tarkistetaan kuuluuko normalisoitu osoite listalle 
  return allowed.includes(normalized);
};

module.exports = { isEmailWhitelisted };