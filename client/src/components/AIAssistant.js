import React, { useState, useRef, useEffect } from 'react';

// ── Brändivärit ja fontit ────────────────────────────
const BRAND = {
  red:        '#e30613',
  darkRed:    '#b3050f',
  white:      '#ffffff',
  lightGray:  '#f5f5f5',
  darkGray:   '#222222',
  fontTitle:  'bold 52px Arial',
  fontBody:   '34px Arial',
  fontSmall:  '24px Arial',
};

// ── Valmiit pohjat ───────────────────────────────────
const TEMPLATES = [
  { label: 'Verenluovutus',   value: 'Luo lyhyt ja kannustava ilmoitus verenluovutustapahtumasta SPR Nilsiän osastolle.' },
  { label: 'Ensiapukurssi',   value: 'Luo kutsu ensiapukurssille. Korosta käytännönläheisyyttä ja hyödyllisyyttä arjessa.' },
  { label: 'Ystäväkerho',     value: 'Luo lämmin kutsu SPR:n ystäväkerhoon yksinäisille tai uusille asukkaille.' },
  { label: 'Tapahtuma',       value: 'Luo yleinen tapahtumailmoitus SPR Nilsiän osastolle. Positiivinen ja kutsuva sävy.' },
  { label: 'Vapaaehtoistyo',  value: 'Luo rekrytointi-ilmoitus vapaaehtoistyöhön. Kerro merkityksellisyydestä ja yhteisöllisyydestä.' },
];

// ── System prompt ────────────────────────────────────
const SYSTEM_PROMPT = `Olet Suomen Punaisen Ristin Nilsiän osaston virallinen viestintäavustaja.
Tehtäväsi on luoda lyhyttä, selkeää ja kannustavaa sisältöä infotaulunäyttöä varten.

Säännöt:
- Käytä lämmintä, asiallista ja positiivista sävyä
- Tekstit ovat lyhyitä — infotaululle sopii max 2–3 lausetta
- Älä käytä liiallista virallisuutta
- Aloita aina positiivisesti
- Vastaa AINA seuraavassa JSON-muodossa ilman muuta tekstiä:
{
  "otsikko": "Lyhyt, iskevä otsikko (max 40 merkkiä)",
  "teksti": "Pääviesti infotaululle (max 180 merkkiä)",
  "hashtagt": "#spr #nilsia #vapaaehtoistyo"
}`;

// ── Canvas-renderöinti ───────────────────────────────
function renderToCanvas(canvas, { otsikko, teksti, hashtagt }) {
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;

  // Tausta
  ctx.fillStyle = BRAND.white;
  ctx.fillRect(0, 0, W, H);

  // Punainen yläpalkki
  ctx.fillStyle = BRAND.red;
  ctx.fillRect(0, 0, W, 140);

  // SPR-teksti palkissa
  ctx.fillStyle = BRAND.white;
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('Suomen Punainen Risti · Nilsiän osasto', 40, 90);

  // Punainen risti -symboli oikealle
  ctx.font = 'bold 80px Arial';
  ctx.textAlign = 'right';
  ctx.fillText('✚', W - 40, 110);

  // Otsikko
  ctx.fillStyle = BRAND.red;
  ctx.font = BRAND.fontTitle;
  ctx.textAlign = 'left';
  wrapText(ctx, otsikko, 40, 220, W - 80, 60);

  // Erotusviiva
  ctx.strokeStyle = BRAND.red;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(40, 300);
  ctx.lineTo(W - 40, 300);
  ctx.stroke();

  // Leipäteksti
  ctx.fillStyle = BRAND.darkGray;
  ctx.font = BRAND.fontBody;
  wrapText(ctx, teksti, 40, 360, W - 80, 44);

  // Hashtagit
  ctx.fillStyle = '#999';
  ctx.font = BRAND.fontSmall;
  ctx.fillText(hashtagt, 40, H - 60);

  // Alakehys
  ctx.fillStyle = BRAND.red;
  ctx.fillRect(0, H - 20, W, 20);
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
}

// ── Pääkomponentti ───────────────────────────────────
export default function AIAssistant({ token, apiUrl, onUploadSuccess }) {
  const [isOpen, setIsOpen]     = useState(false);
  const [prompt, setPrompt]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const canvasRef = useRef(null);

  // Renderöi canvas aina kun result muuttuu
  useEffect(() => {
    if (result && canvasRef.current) {
      renderToCanvas(canvasRef.current, result);
    }
  }, [result]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setUploadMsg('');

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.REACT_APP_ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true'
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 500,
          system: SYSTEM_PROMPT,
          messages: [
            { role: 'user', content: prompt }
          ]
        })
      });

      const data = await res.json();
      const text = data.content[0].text;

      // Siivoa mahdolliset ```json ... ``` -kehykset
      const clean = text.replace(/```json|```/g, '').trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);

    } catch (err) {
      console.error(err);
      setError('Generointi epäonnistui. Tarkista API-avain ja yritä uudelleen.');
    } finally {
      setLoading(false);
    }
  };

  // Muunna canvas PNG:ksi ja lataa hallintaan
  const handleUploadToBoard = async () => {
    if (!canvasRef.current || !result) return;
    setUploading(true);
    setUploadMsg('');

    try {
      // Canvas → Blob
      const blob = await new Promise((resolve) =>
        canvasRef.current.toBlob(resolve, 'image/png')
      );

      const filename = `AI_${result.otsikko.replace(/\s+/g, '_').slice(0, 30)}_${Date.now()}.png`;
      const file = new File([blob], filename, { type: 'image/png' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', 'AI-avustaja');

      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) throw new Error('Lataus epäonnistui');

      setUploadMsg('✅ Lisätty infotaululle!');
      if (onUploadSuccess) onUploadSuccess(); // päivitä tiedostolista

    } catch (err) {
      setUploadMsg(`❌ Virhe: ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Avauspainike */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: 'auto',
          padding: '8px 16px',
          backgroundColor: '#7c3aed',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        ✨ AI-sisältöavustaja
      </button>

      {/* Sivupaneeli */}
      {isOpen && (
        <div style={{
          position: 'fixed',
          top: 0, right: 0,
          width: '420px',
          height: '100vh',
          backgroundColor: '#fff',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.15)',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}>

          {/* Header */}
          <div style={{
            backgroundColor: '#7c3aed',
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <span style={{ color: 'white', fontWeight: '700', fontSize: '1rem' }}>
              ✨ AI-sisältöavustaja
            </span>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none', border: 'none',
                color: 'white', fontSize: '1.4rem',
                cursor: 'pointer', width: 'auto', padding: '0 4px'
              }}
            >
              ✕
            </button>
          </div>

          {/* Sisältö */}
          <div style={{ padding: '20px', flex: 1 }}>

            {/* Valmiit pohjat */}
            <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600' }}>
              Valitse pohja tai kirjoita oma:
            </label>
            <select
              onChange={(e) => setPrompt(e.target.value)}
              defaultValue=""
              style={{
                width: '100%', padding: '8px 10px',
                border: '1px solid #e2e8f0', borderRadius: '6px',
                fontSize: '0.9rem', marginTop: '6px', marginBottom: '12px',
                color: '#1e293b'
              }}
            >
              <option value="">Valitse pohja...</option>
              {TEMPLATES.map(t => (
                <option key={t.label} value={t.value}>{t.label}</option>
              ))}
            </select>

            {/* Vapaa tekstikenttä */}
            <textarea
              placeholder="Kirjoita aihe tai kuvaus..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={4}
              style={{
                width: '100%', padding: '10px',
                border: '1px solid #e2e8f0', borderRadius: '6px',
                fontSize: '0.9rem', resize: 'vertical',
                fontFamily: 'inherit', color: '#1e293b',
                boxSizing: 'border-box'
              }}
            />

            {/* Generoi-nappi */}
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              style={{
                width: '100%', marginTop: '10px',
                padding: '10px', backgroundColor: loading ? '#a78bfa' : '#7c3aed',
                color: 'white', border: 'none', borderRadius: '8px',
                fontSize: '1rem', fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? '⏳ Generoidaan...' : '✨ Generoi sisältö'}
            </button>

            {error && (
              <p style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '8px' }}>
                {error}
              </p>
            )}

            {/* Tulokset */}
            {result && (
              <div style={{ marginTop: '20px' }}>

                {/* Tekstimuotoinen tulos */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '14px',
                  marginBottom: '16px'
                }}>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                      OTSIKKO
                    </span>
                    <p style={{ margin: '2px 0 0', fontWeight: '700', color: '#e30613' }}>
                      {result.otsikko}
                    </p>
                  </div>
                  <div style={{ marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                      TEKSTI
                    </span>
                    <p style={{ margin: '2px 0 0', color: '#1e293b', fontSize: '0.9rem' }}>
                      {result.teksti}
                    </p>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600' }}>
                      HASHTAGIT
                    </span>
                    <p style={{ margin: '2px 0 0', color: '#7c3aed', fontSize: '0.85rem' }}>
                      {result.hashtagt}
                    </p>
                  </div>
                </div>

                {/* Canvas-esikatselu */}
                <p style={{
                  fontSize: '0.8rem', color: '#64748b',
                  fontWeight: '600', marginBottom: '6px'
                }}>
                  ESIKATSELU — infotaulun näkymä:
                </p>
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  style={{
                    width: '100%',
                    height: 'auto',
                    border: '2px solid #e2e8f0',
                    borderRadius: '8px',
                    display: 'block'
                  }}
                />

                {/* Toimintopainikkeet */}
                <div style={{
                  display: 'flex', gap: '8px',
                  marginTop: '12px', flexWrap: 'wrap'
                }}>
                  <button
                    onClick={() => navigator.clipboard.writeText(
                      `${result.otsikko}\n\n${result.teksti}\n\n${result.hashtagt}`
                    )}
                    style={{
                      flex: 1, padding: '8px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569', border: '1px solid #e2e8f0',
                      borderRadius: '6px', fontSize: '0.85rem',
                      cursor: 'pointer', fontWeight: '500', width: 'auto'
                    }}
                  >
                    📋 Kopioi teksti
                  </button>

                  <button
                    onClick={handleUploadToBoard}
                    disabled={uploading}
                    style={{
                      flex: 1, padding: '8px',
                      backgroundColor: uploading ? '#94a3b8' : '#e30613',
                      color: 'white', border: 'none',
                      borderRadius: '6px', fontSize: '0.85rem',
                      cursor: uploading ? 'not-allowed' : 'pointer',
                      fontWeight: '600', width: 'auto'
                    }}
                  >
                    {uploading ? '⏳ Ladataan...' : '📤 Lisää infotaululle'}
                  </button>
                </div>

                {uploadMsg && (
                  <p style={{
                    marginTop: '8px', fontSize: '0.85rem',
                    color: uploadMsg.startsWith('✅') ? '#16a34a' : '#dc2626'
                  }}>
                    {uploadMsg}
                  </p>
                )}

                {/* Generoi uudelleen */}
                <button
                  onClick={() => { setResult(null); setUploadMsg(''); }}
                  style={{
                    width: '100%', marginTop: '8px', padding: '8px',
                    backgroundColor: 'transparent',
                    color: '#7c3aed', border: '1px solid #7c3aed',
                    borderRadius: '6px', fontSize: '0.85rem',
                    cursor: 'pointer', fontWeight: '500'
                  }}
                >
                  🔄 Generoi uusi
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Taustapeitto kun paneeli auki */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed', inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 999
          }}
        />
      )}
    </>
  );
}