import React, { useState } from 'react';

// ─────────────────────────────────────────────────────────────────
// Brändätty HTML-pohja infotaululle (9:16 pystysuunta)
// SPR Nilsiän osaston värit ja tyyli
// ─────────────────────────────────────────────────────────────────
function generateBrandedHTML({ otsikko, sisalto, kehotus, template }) {
  const templates = {

    // Punainen otsikkokortti — yleisin
    perus: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #1a1a2e;
      width: 1080px; height: 1920px;
      display: flex; flex-direction: column;
      align-items: center; justify-content: center;
      padding: 80px;
    }
    .card {
      background: #fff;
      border-radius: 24px;
      overflow: hidden;
      width: 100%;
      box-shadow: 0 32px 80px rgba(0,0,0,0.4);
    }
    .header {
      background: #e30613;
      padding: 60px 64px 48px;
    }
    .logo-bar {
      display: flex; align-items: center;
      gap: 16px; margin-bottom: 40px;
    }
    .logo-circle {
      width: 56px; height: 56px;
      background: #fff; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 28px; font-weight: 800; color: #e30613;
      flex-shrink: 0;
    }
    .org-name {
      color: rgba(255,255,255,0.9);
      font-size: 28px; font-weight: 600; line-height: 1.2;
    }
    .title {
      color: #fff;
      font-size: 72px; font-weight: 800;
      line-height: 1.1; letter-spacing: -1px;
    }
    .body {
      padding: 64px; background: #fff;
    }
    .content {
      font-size: 44px; color: #1e293b;
      line-height: 1.55; font-weight: 400;
      margin-bottom: 48px;
    }
    .cta {
      display: inline-block;
      background: #e30613; color: #fff;
      font-size: 36px; font-weight: 700;
      padding: 28px 52px; border-radius: 60px;
    }
    .footer {
      padding: 32px 64px;
      background: #f8fafc;
      border-top: 1px solid #e2e8f0;
      display: flex; justify-content: space-between; align-items: center;
    }
    .footer-text { color: #94a3b8; font-size: 26px; }
    .cross {
      color: #e30613; font-size: 36px; font-weight: 800;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo-bar">
        <div class="logo-circle">✚</div>
        <div class="org-name">Suomen Punainen Risti<br>Nilsiän osasto</div>
      </div>
      <div class="title">${otsikko}</div>
    </div>
    <div class="body">
      <div class="content">${sisalto.replace(/\n/g, '<br>')}</div>
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">
      <span class="footer-text">sprinfotaulu.fi</span>
      <span class="cross">✚</span>
    </div>
  </div>
</body>
</html>`,

    // Tumma teema — tapahtumailmoitukset
    tumma: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #0f172a;
      width: 1080px; height: 1920px;
      display: flex; flex-direction: column;
      align-items: stretch; justify-content: space-between;
      padding: 0;
    }
    .top-bar {
      background: #e30613;
      padding: 40px 64px;
      display: flex; align-items: center; gap: 20px;
    }
    .top-bar-text { color: #fff; font-size: 30px; font-weight: 600; }
    .main {
      flex: 1; padding: 80px 64px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .title {
      color: #fff; font-size: 80px; font-weight: 800;
      line-height: 1.05; margin-bottom: 48px;
      letter-spacing: -2px;
    }
    .divider {
      width: 80px; height: 6px;
      background: #e30613; border-radius: 3px;
      margin-bottom: 48px;
    }
    .content {
      color: #cbd5e1; font-size: 46px;
      line-height: 1.55; font-weight: 400;
    }
    .cta {
      margin-top: 64px;
      background: #e30613; color: #fff;
      font-size: 38px; font-weight: 700;
      padding: 32px 56px; border-radius: 12px;
      display: inline-block; width: fit-content;
    }
    .bottom {
      padding: 40px 64px;
      border-top: 1px solid #1e293b;
      display: flex; justify-content: space-between;
    }
    .bottom-text { color: #475569; font-size: 26px; }
  </style>
</head>
<body>
  <div class="top-bar">
    <span style="font-size:36px; color:#fff;">✚</span>
    <span class="top-bar-text">Suomen Punainen Risti — Nilsiän osasto</span>
  </div>
  <div class="main">
    <div class="title">${otsikko}</div>
    <div class="divider"></div>
    <div class="content">${sisalto.replace(/\n/g, '<br>')}</div>
    ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
  </div>
  <div class="bottom">
    <span class="bottom-text">sprinfotaulu.fi</span>
    <span class="bottom-text">✚ SPR Nilsiä</span>
  </div>
</body>
</html>`,

    // Minimalistinen — ilmoitukset ja tiedotteet
    minimalistinen: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #fff;
      width: 1080px; height: 1920px;
      display: flex; flex-direction: column;
    }
    .side-bar {
      position: fixed; left: 0; top: 0; bottom: 0;
      width: 16px; background: #e30613;
    }
    .content-wrap {
      flex: 1; padding: 120px 80px 80px 96px;
      display: flex; flex-direction: column; justify-content: center;
    }
    .tag {
      background: #fef2f2; color: #e30613;
      font-size: 28px; font-weight: 700;
      padding: 12px 28px; border-radius: 60px;
      display: inline-block; margin-bottom: 56px;
      text-transform: uppercase; letter-spacing: 2px;
    }
    .title {
      font-size: 88px; font-weight: 800;
      color: #0f172a; line-height: 1.0;
      letter-spacing: -3px; margin-bottom: 56px;
    }
    .content {
      font-size: 48px; color: #334155;
      line-height: 1.6; font-weight: 400;
    }
    .cta {
      margin-top: 72px;
      color: #e30613; font-size: 40px; font-weight: 700;
      border-bottom: 3px solid #e30613;
      display: inline-block; padding-bottom: 4px;
    }
    .footer {
      padding: 48px 80px 48px 96px;
      display: flex; justify-content: space-between; align-items: center;
      border-top: 1px solid #f1f5f9;
    }
    .footer-org { font-size: 26px; color: #94a3b8; font-weight: 500; }
    .footer-cross { font-size: 40px; color: #e30613; }
  </style>
</head>
<body>
  <div class="side-bar"></div>
  <div class="content-wrap">
    <div class="tag">✚ SPR Nilsiä</div>
    <div class="title">${otsikko}</div>
    <div class="content">${sisalto.replace(/\n/g, '<br>')}</div>
    ${kehotus ? `<div class="cta">${kehotus} →</div>` : ''}
  </div>
  <div class="footer">
    <span class="footer-org">sprinfotaulu.fi</span>
    <span class="footer-cross">✚</span>
  </div>
</body>
</html>`
  };

  return templates[template] || templates.perus;
}

// ─────────────────────────────────────────────────────────────────
// AIAssistant-komponentti
// ─────────────────────────────────────────────────────────────────
export default function AIAssistant({ token, apiUrl, onUploadSuccess }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);        // { otsikko, sisalto, kehotus }
  const [template, setTemplate] = useState('perus');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [open, setOpen] = useState(false);

  // Generoi teksti backendiltä
  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError('');
    setResult(null);
    setUploadMsg('');

    try {
      const res = await fetch(`${apiUrl}/api/ai/generate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Virhe (${res.status})`);
      }

      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'AI-generointi epäonnistui');
    } finally {
      setLoading(false);
    }
  };

  // Lataa generoitu HTML-sisältö järjestelmään
  const handleUpload = async () => {
    if (!result) return;
    setUploading(true);
    setUploadMsg('');

    const html = generateBrandedHTML({ ...result, template });
    const blob = new Blob([html], { type: 'text/html' });

    // Tiedostonimi otsikosta
    const safeName = result.otsikko
      .toLowerCase()
      .replace(/[^a-zäöå0-9]/g, '_')
      .replace(/_+/g, '_')
      .substring(0, 40);
    const filename = `ai_${safeName}_${Date.now()}.html`;
    const file = new File([blob], filename, { type: 'text/html' });

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', 'ai-assistantti');

    try {
      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Lataus epäonnistui');
      setUploadMsg('✅ Sisältö ladattu infotaululle!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setUploadMsg(`❌ ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  // Lataa HTML omalle koneelle
  const handleDownloadHTML = () => {
    if (!result) return;
    const html = generateBrandedHTML({ ...result, template });
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `infotaulu_${Date.now()}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const TEMPLATES = [
    { id: 'perus',         label: '🟥 Punainen kortti' },
    { id: 'tumma',         label: '⬛ Tumma teema' },
    { id: 'minimalistinen', label: '⬜ Minimalistinen' },
  ];

  const ESIMERKIT = [
    'Ensiapukurssi lokakuussa — kerro päivämäärä ja ilmoittautuminen',
    'Verenluovutuspäivä marraskuussa — rohkaise osallistumaan',
    'Ystäväkerho kokoontuu — kerro aika ja paikka',
    'Tarvitsemme uusia vapaaehtoisia — kutsu mukaan toimintaan',
  ];

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '8px'
    }}>

      {/* Otsikkorivi — avaa/sulkee */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left',
          padding: '14px 18px',
          background: open ? '#fef2f2' : '#f8fafc',
          border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          borderBottom: open ? '1px solid #fecaca' : 'none'
        }}
      >
        <span style={{ fontWeight: '600', fontSize: '0.95rem', color: '#1e293b' }}>
          ✨ AI-sisältöapuri
        </span>
        <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          {open ? '▲ Sulje' : '▼ Avaa'}
        </span>
      </button>

      {open && (
        <div style={{ padding: '18px', background: '#fff' }}>

          {/* Kuvauskenttä */}
          <label style={{ fontSize: '0.83rem', color: '#475569', display: 'block', marginBottom: '6px', fontWeight: '600' }}>
            Kuvaile sisältö suomeksi:
          </label>
          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Esim: Ensiapukurssi järjestetään 15. lokakuuta Nilsiän palotalonparkin kokoussalissa. Ilmoittaudu viimeistään 10.10."
            rows={3}
            style={{
              width: '100%', padding: '10px 12px',
              border: '2px solid #e2e8f0', borderRadius: '8px',
              fontSize: '0.88rem', lineHeight: '1.5',
              resize: 'vertical', fontFamily: 'inherit',
              color: '#1e293b'
            }}
            onFocus={e => e.target.style.borderColor = '#e30613'}
            onBlur={e => e.target.style.borderColor = '#e2e8f0'}
          />

          {/* Esimerkkipainikkeet */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '8px 0 12px' }}>
            {ESIMERKIT.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                style={{
                  padding: '4px 10px', fontSize: '0.75rem',
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                  borderRadius: '20px', cursor: 'pointer', color: '#475569',
                  fontWeight: '500', width: 'auto'
                }}
              >
                {ex.split('—')[0].trim()}
              </button>
            ))}
          </div>

          {/* Generoi-nappi */}
          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              width: '100%', padding: '11px',
              background: loading || !prompt.trim() ? '#94a3b8' : '#e30613',
              color: '#fff', border: 'none', borderRadius: '8px',
              fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer'
            }}
          >
            {loading ? '⏳ Generoidaan...' : '✨ Luo sisältö'}
          </button>

          {error && (
            <p style={{ color: '#dc2626', fontSize: '0.83rem', marginTop: '8px' }}>{error}</p>
          )}

          {/* Tulos */}
          {result && (
            <div style={{ marginTop: '16px' }}>

              {/* Muokattavat kentät */}
              <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '14px', marginBottom: '12px' }}>
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  OTSIKKO
                </label>
                <input
                  value={result.otsikko}
                  onChange={e => setResult(r => ({ ...r, otsikko: e.target.value }))}
                  style={{
                    width: '100%', padding: '7px 10px',
                    border: '1px solid #e2e8f0', borderRadius: '6px',
                    fontSize: '0.95rem', fontWeight: '700', marginBottom: '10px'
                  }}
                />
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  SISÄLTÖ
                </label>
                <textarea
                  value={result.sisalto}
                  onChange={e => setResult(r => ({ ...r, sisalto: e.target.value }))}
                  rows={3}
                  style={{
                    width: '100%', padding: '7px 10px',
                    border: '1px solid #e2e8f0', borderRadius: '6px',
                    fontSize: '0.88rem', resize: 'vertical', marginBottom: '10px'
                  }}
                />
                <label style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', display: 'block', marginBottom: '4px' }}>
                  KEHOTUS (valinnainen)
                </label>
                <input
                  value={result.kehotus}
                  onChange={e => setResult(r => ({ ...r, kehotus: e.target.value }))}
                  placeholder="Esim: Ilmoittaudu nyt →"
                  style={{
                    width: '100%', padding: '7px 10px',
                    border: '1px solid #e2e8f0', borderRadius: '6px',
                    fontSize: '0.88rem'
                  }}
                />
              </div>

              {/* Pohjavalinta */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: '600', marginBottom: '6px', marginTop: 0 }}>
                  POHJA
                </p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      style={{
                        flex: 1, padding: '8px 4px',
                        border: `2px solid ${template === t.id ? '#e30613' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        background: template === t.id ? '#fef2f2' : '#fff',
                        fontSize: '0.75rem', fontWeight: '600',
                        color: template === t.id ? '#e30613' : '#475569',
                        cursor: 'pointer', width: 'auto'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toimintopainikkeet */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  style={{
                    flex: 2, padding: '11px',
                    background: uploading ? '#94a3b8' : '#16a34a',
                    color: '#fff', border: 'none', borderRadius: '8px',
                    fontSize: '0.88rem', fontWeight: '700', cursor: 'pointer',
                    width: 'auto'
                  }}
                >
                  {uploading ? '⏳ Ladataan...' : '⬆ Lisää infotaululle'}
                </button>
                <button
                  onClick={handleDownloadHTML}
                  style={{
                    flex: 1, padding: '11px',
                    background: '#f1f5f9', color: '#475569',
                    border: '1px solid #e2e8f0', borderRadius: '8px',
                    fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer',
                    width: 'auto'
                  }}
                >
                  ⬇ HTML
                </button>
              </div>

              {uploadMsg && (
                <p style={{
                  fontSize: '0.83rem',
                  color: uploadMsg.includes('✅') ? '#16a34a' : '#dc2626',
                  marginTop: '8px', marginBottom: 0
                }}>
                  {uploadMsg}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}