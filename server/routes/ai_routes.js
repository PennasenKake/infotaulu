
// server/routes/ai_routes.js
const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.post('/generate', authenticateToken, async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || prompt.trim().length < 5) {
    return res.status(400).json({ error: 'Anna pidempi kuvaus sisällöstä' });
  }

  console.log("🔄 Groq AI-pyyntö:", prompt.substring(0, 80) + "...");

  if (!process.env.GROQ_API_KEY) {
    return res.status(500).json({ error: 'GROQ_API_KEY puuttuu ympäristömuuttujista' });
  }

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",        // nopea ja hyvä
        // model: "llama3-8b-8192",      // vaihtoehtoisesti kevyempi
        messages: [
          { 
            role: "system", 
            content: `Olet Suomen Punaisen Ristin Nilsiän osaston infotaulun sisältöassistentti.
Kirjoita selkeää, lyhyttä ja innostavaa tekstiä infotaululle.
Pidä SPR:n brändi: luotettava, auttavainen, yhteisöllinen.

Palauta VAIN JSON-muodossa:
{
  "otsikko": "...",
  "sisalto": "...",
  "kehotus": "..." 
}` 
          },
          { role: "user", content: prompt.trim() }
        ],
        max_tokens: 500,
        temperature: 0.75
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Groq virhe:", data);
      return res.status(500).json({ 
        error: data.error?.message || 'Groq API virhe' 
      });
    }

    const rawText = data.choices[0]?.message?.content || '';

    let parsed;
    try {
      const cleaned = rawText.replace(/```json|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    } catch (e) {
      parsed = { 
        otsikko: "Uusi tiedote", 
        sisalto: rawText, 
        kehotus: "" 
      };
    }

    console.log("✅ Groq-generointi onnistui");
    res.json({
      otsikko: parsed.otsikko || "Tiedote",
      sisalto: parsed.sisalto || rawText,
      kehotus: parsed.kehotus || ""
    });

  } catch (err) {
    console.error('Groq virhe:', err);
    res.status(500).json({ error: 'AI-generointi epäonnistui' });
  }
});

module.exports = router;



// // server/routes/ai_routes.js

// const express = require('express');
// const router = express.Router();
// const { authenticateToken } = require('../middleware/auth');

// router.post('/generate', authenticateToken, async (req, res) => {
//   const { prompt } = req.body;

//   if (!prompt || prompt.trim().length < 5) {
//     return res.status(400).json({ error: 'Anna pidempi kuvaus sisällöstä' });
//   }

//   console.log("🔄 AI-pyyntö vastaanotettu:", prompt.substring(0, 100) + "...");

//   if (!process.env.OPENAI_API_KEY) {
//     console.error("❌ OPENAI_API_KEY puuttuu ympäristömuuttujista!");
//     return res.status(500).json({ 
//       error: 'OPENAI_API_KEY ei ole asetettu Railwayssä' 
//     });
//   }

//   try {
//     const response = await fetch('https://api.openai.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
//       },
//       body: JSON.stringify({
//         model: "gpt-4o-mini",
//         messages: [
//           { 
//             role: "system", 
//             content: `Olet Suomen Punaisen Ristin Nilsiän osaston infotaulun sisältöassistentti...` 
//           },
//           { role: "user", content: prompt.trim() }
//         ],
//         max_tokens: 450,
//         temperature: 0.75
//       })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       console.error("OpenAI API virhe:", data);
//       return res.status(500).json({ 
//         error: data.error?.message || `OpenAI virhe (${response.status})` 
//       });
//     }

//     const rawText = data.choices[0]?.message?.content || '';

//     let parsed;
//     try {
//       const cleaned = rawText.replace(/```json|```/g, '').trim();
//       parsed = JSON.parse(cleaned);
//     } catch (e) {
//       console.log("JSON-parsinta epäonnistui, käytetään raakatekstiä");
//       parsed = { otsikko: "Uusi tiedote", sisalto: rawText, kehotus: "" };
//     }

//     console.log("✅ AI-generointi onnistui");
//     res.json({
//       otsikko: parsed.otsikko || "Tiedote",
//       sisalto: parsed.sisalto || rawText,
//       kehotus: parsed.kehotus || ""
//     });

//   } catch (err) {
//     console.error("❌ AI generate virhe:", err);
//     res.status(500).json({ 
//       error: 'AI-generointi epäonnistui. Tarkista palvelimen lokit.' 
//     });
//   }
// });

// module.exports = router;