const express = require('express');
const router = express.Router();
const Anthropic = require('@anthropic-ai/sdk');
const { authenticateToken } = require('../middleware/auth');

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// POST /api/ai/generate
// Vaatii JWT-tokenin — vain kirjautuneet käyttäjät voivat käyttää
router.post('/generate', authenticateToken, async (req, res) => {
  const { prompt, template } = req.body;

  if (!prompt || prompt.trim().length < 3) {
    return res.status(400).json({ error: 'Kuvaile sisältö (vähintään 3 merkkiä)' });
  }

  // Järjestelmäohje — ohjaa tekoälyn tuottamaan infotaulutekstiä
  const systemPrompt = `Olet Suomen Punaisen Ristin Nilsiän osaston infotaulun sisältöassistentti.
Tehtäväsi on kirjoittaa selkeää, lyhyttä ja informatiivista tekstiä infotaululle.

Säännöt:
- Kirjoita suomeksi
- Otsikko: enintään 6 sanaa, selkeä ja napakka
- Pääsisältö: 2–4 lausetta, tiivis ja helposti luettava
- Yksi selkeä kehotus toimintaan (jos sopii)
- Ei turhia koristeluja tai täytesanoja
- Pidä brändi: ystävällinen, luotettava, paikallinen

Palauta AINOASTAAN JSON-muodossa, ei muuta tekstiä:
{
  "otsikko": "...",
  "sisalto": "...",
  "kehotus": "..." 
}

Jos kehotusta ei tarvita, jätä kenttä tyhjäksi: "kehotus": ""`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5',
      max_tokens: 400,
      system: systemPrompt,
      messages: [
        { role: 'user', content: prompt.trim() }
      ]
    });

    const rawText = message.content[0]?.text || '';

    // Parsitaan JSON-vastaus
    let parsed;
    try {
      // Poistetaan mahdolliset markdown-koodimerkit
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback jos JSON-parsinta epäonnistuu
      return res.json({
        otsikko: 'Ilmoitus',
        sisalto: rawText,
        kehotus: ''
      });
    }

    res.json({
      otsikko: parsed.otsikko || '',
      sisalto: parsed.sisalto || '',
      kehotus: parsed.kehotus || ''
    });

  } catch (err) {
    console.error('AI generate error:', err);

    if (err.status === 401) {
      return res.status(500).json({ error: 'AI-palvelun API-avain puuttuu tai on virheellinen' });
    }
    if (err.status === 429) {
      return res.status(429).json({ error: 'Liian monta pyyntöä — odota hetki' });
    }

    res.status(500).json({ error: 'AI-generointi epäonnistui' });
  }
});

module.exports = router;