// server/routes/ai_routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.post('/generate', authenticateToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length < 5) {
    return res.status(400).json({ error: 'Anna pidempi kuvaus sisällöstä' });
  }

  const systemPrompt = `Olet Suomen Punaisen Ristin Nilsiän osaston infotaulun sisältöassistentti.
Tehtäväsi on kirjoittaa selkeää, lyhyttä ja innostavaa tekstiä infotaululle.

Säännöt:
- Kirjoita aina suomeksi
- Otsikko: enintään 6–8 sanaa, napakka ja selkeä
- Sisältö: 2–5 lausetta, helppolukuista
- Anna tarvittaessa selkeä kehotus toimintaan
- Pidä SPR:n brändi: luotettava, auttavainen, yhteisöllinen

Palauta VAIN JSON-muodossa:
{
  "otsikko": "...",
  "sisalto": "...",
  "kehotus": "..." 
}`;

  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY puuttuu ympäristömuuttujista');
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",        // halpa ja nopea
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt.trim() }
        ],
        max_tokens: 450,
        temperature: 0.75
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI error:", data);
      throw new Error(data.error?.message || 'OpenAI API virhe');
    }

    const rawText = data.choices[0].message.content;

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        otsikko: "Uusi tiedote",
        sisalto: rawText,
        kehotus: ""
      };
    }

    res.json({
      otsikko: parsed.otsikko || "Tiedote",
      sisalto: parsed.sisalto || rawText,
      kehotus: parsed.kehotus || ""
    });

  } catch (err) {
    console.error('AI generate error:', err);
    res.status(500).json({ 
      error: err.message.includes('API key') 
        ? 'API-avain on virheellinen tai puuttuu' 
        : 'AI-generointi epäonnistui. Kokeile uudelleen.' 
    });
  }
});

module.exports = router;