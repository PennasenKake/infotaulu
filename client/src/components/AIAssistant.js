// client/src/components/AIAssistant.js
import React, { useState } from 'react';

function generateBrandedHTML({ otsikko, sisalto, kehotus, template }) {
  const templates = {

    // 1. PUNAINEN KORTTI - Suosituin ja näyttävin
    perus: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #f8fafc;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
      padding: 60px;
    }
    .card {
      background: white;
      border-radius: 32px;
      overflow: hidden;
      width: 100%; max-width: 920px;
      box-shadow: 0 30px 80px rgba(227,6,19,0.18);
    }
    .header {
      background: linear-gradient(135deg, #e30613, #c00410);
      padding: 80px 60px 55px;
      text-align: center;
    }
    .logo {
      display: flex; align-items: center; justify-content: center; gap: 18px;
      margin-bottom: 35px;
    }
    .logo-circle {
      width: 72px; height: 72px;
      background: white; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 36px; color: #e30613; font-weight: 900;
    }
    .title {
      color: white;
      font-size: 68px; font-weight: 800;
      line-height: 1.05; letter-spacing: -2px;
    }
    .body {
      padding: 75px 65px;
      font-size: 44px; line-height: 1.45;
      color: #1e293b;
    }
    .cta {
      margin-top: 55px;
      background: #e30613; color: white;
      font-size: 36px; font-weight: 700;
      padding: 26px 52px; border-radius: 9999px;
      display: inline-block;
    }
    .footer {
      background: #f1f5f9; padding: 32px 65px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 26px; color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">
        <div class="logo-circle">✚</div>
        <div style="color:white; font-size:29px; font-weight:700;">SPR Nilsiä</div>
      </div>
      <div class="title">${otsikko}</div>
    </div>
    <div class="body">
      <div>${sisalto.replace(/\n/g, '<br><br>')}</div>
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">
      <span>sprinfotaulu.fi</span>
      <span>✚ Suomen Punainen Risti</span>
    </div>
  </div>
</body>
</html>`,

    // 2. TUMMA TEEMA - Tapahtumat ja tärkeät tiedotteet
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
      display: flex; align-items: center; justify-content: center;
      padding: 60px;
    }
    .card {
      background: #1e293b;
      border-radius: 28px;
      overflow: hidden;
      width: 100%; max-width: 900px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    }
    .header {
      background: #e30613;
      padding: 65px 60px 45px;
      text-align: center;
    }
    .title {
      color: white;
      font-size: 72px; font-weight: 800;
      line-height: 1.05;
    }
    .body {
      padding: 70px 65px;
      font-size: 42px; line-height: 1.5;
      color: #e2e8f0;
    }
    .cta {
      margin-top: 50px;
      background: white; color: #e30613;
      font-size: 36px; font-weight: 700;
      padding: 24px 50px; border-radius: 9999px;
      display: inline-block;
    }
    .footer {
      padding: 35px 65px;
      color: #94a3b8;
      font-size: 26px;
      display: flex; justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size:32px; margin-bottom:25px;">✚ SPR Nilsiä</div>
      <div class="title">${otsikko}</div>
    </div>
    <div class="body">
      <div>${sisalto.replace(/\n/g, '<br><br>')}</div>
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">
      <span>sprinfotaulu.fi</span>
      <span>✚ Punainen Risti</span>
    </div>
  </div>
</body>
</html>`,

    // 3. MINIMALISTINEN - Selkeä ja tyylikäs
    minimalistinen: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #ffffff;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
      padding: 80px;
    }
    .card {
      width: 100%; max-width: 880px;
      border: 8px solid #e30613;
      border-radius: 20px;
      padding: 90px 70px;
      text-align: center;
    }
    .title {
      font-size: 78px; font-weight: 800;
      color: #0f172a; line-height: 1.05;
      margin-bottom: 50px;
    }
    .content {
      font-size: 46px; line-height: 1.5;
      color: #334155;
      margin-bottom: 60px;
    }
    .cta {
      font-size: 38px; font-weight: 700;
      color: #e30613;
      border-bottom: 5px solid #e30613;
      display: inline-block;
      padding-bottom: 6px;
    }
    .footer {
      margin-top: 80px;
      font-size: 26px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">${otsikko}</div>
    <div class="content">${sisalto.replace(/\n/g, '<br><br>')}</div>
    ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    <div class="footer">Suomen Punainen Risti — Nilsiän osasto ✚</div>
  </div>
</body>
</html>`
  };

  return templates[template] || templates.perus;
}

export default function AIAssistant({ token, apiUrl, onUploadSuccess }) {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState(null);
  const [template, setTemplate] = useState('perus');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');
  const [open, setOpen] = useState(false);

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

  const handleUpload = async () => {
    if (!result) return;
    setUploading(true);
    setUploadMsg('');

    try {
      const html = generateBrandedHTML({ ...result, template });
      const blob = new Blob([html], { type: 'text/html' });

      const safeName = (result.otsikko || 'sisalto')
        .toLowerCase()
        .replace(/[^a-zäöå0-9]/g, '_')
        .replace(/_+/g, '_')
        .substring(0, 35);

      const filename = `ai_${safeName}_${Date.now()}.html`;
      const file = new File([blob], filename, { type: 'text/html' });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploadedBy', 'AI-avustaja');

      const res = await fetch(`${apiUrl}/api/upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });

      if (!res.ok) throw new Error('Lataus epäonnistui');
      
      setUploadMsg('✅ Sisältö lisätty infotaululle!');
      if (onUploadSuccess) onUploadSuccess();
    } catch (err) {
      setUploadMsg(`❌ ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

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
    { id: 'perus', label: '🟥 Punainen kortti' },
    { id: 'tumma', label: '⬛ Tumma teema' },
    { id: 'minimalistinen', label: '⬜ Minimalistinen' },
  ];

  const ESIMERKIT = [
    "Ensiapukurssi lokakuussa",
    "Verenluovutuspäivä marraskuussa",
    "Tarvitsemme uusia vapaaehtoisia",
    "Ystäväkerho kokoontuu torstaina"
  ];

  return (
    <div style={{
      border: '1px solid #e2e8f0',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '16px'
    }}>

      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', textAlign: 'left', padding: '16px 20px',
          background: open ? '#fef2f2' : '#f8fafc',
          border: 'none', cursor: 'pointer',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}
      >
        <span style={{ fontWeight: '700', fontSize: '1.05rem' }}>✨ AI-sisältöapuri</span>
        <span>{open ? '▲ Sulje' : '▼ Avaa'}</span>
      </button>

      {open && (
        <div style={{ padding: '20px', background: '#fff' }}>
          <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600', display: 'block', marginBottom: '6px' }}>
            Kuvaile sisältö suomeksi:
          </label>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Esim: Ensiapukurssi järjestetään 15.10. Nilsiän palotalolla..."
            rows={4}
            style={{
              width: '100%', padding: '12px', border: '2px solid #e2e8f0',
              borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical'
            }}
          />

          {/* Esimerkit */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 14px' }}>
            {ESIMERKIT.map((ex, i) => (
              <button
                key={i}
                onClick={() => setPrompt(ex)}
                style={{
                  padding: '5px 12px', fontSize: '0.78rem',
                  background: '#f1f5f9', border: '1px solid #e2e8f0',
                  borderRadius: '20px', cursor: 'pointer'
                }}
              >
                {ex}
              </button>
            ))}
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            style={{
              width: '100%', padding: '12px', marginBottom: '12px',
              background: loading || !prompt.trim() ? '#94a3b8' : '#e30613',
              color: 'white', border: 'none', borderRadius: '8px',
              fontSize: '1rem', fontWeight: '700', cursor: 'pointer'
            }}
          >
            {loading ? '⏳ Generoidaan...' : '✨ Luo sisältö'}
          </button>

          {error && <p style={{ color: '#dc2626' }}>{error}</p>}

          {result && (
            <div style={{ marginTop: '16px' }}>
              {/* Muokattavat kentät */}
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
                <label>Otsikko</label>
                <input value={result.otsikko} onChange={e => setResult(r => ({...r, otsikko: e.target.value}))} style={{width:'100%', marginBottom:'10px'}} />

                <label>Sisältö</label>
                <textarea value={result.sisalto} onChange={e => setResult(r => ({...r, sisalto: e.target.value}))} rows={4} style={{width:'100%', marginBottom:'10px'}} />

                <label>Kehotus (valinnainen)</label>
                <input value={result.kehotus} onChange={e => setResult(r => ({...r, kehotus: e.target.value}))} placeholder="Esim. Ilmoittaudu nyt" style={{width:'100%'}} />
              </div>

              {/* Pohjavalinta */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{fontWeight:'600', marginBottom:'6px'}}>Valitse pohja</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      style={{
                        flex: 1, padding: '10px',
                        border: `2px solid ${template === t.id ? '#e30613' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        background: template === t.id ? '#fef2f2' : '#fff',
                        fontWeight: '600'
                      }}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toiminnot */}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={handleUpload} disabled={uploading} style={{ flex: 2, padding: '12px', background: '#16a34a', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700' }}>
                  {uploading ? 'Ladataan...' : '⬆ Lisää infotaululle'}
                </button>
                <button onClick={handleDownloadHTML} style={{ flex: 1, padding: '12px', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: '8px', fontWeight: '600' }}>
                  ⬇ HTML
                </button>
              </div>

              {uploadMsg && <p style={{ marginTop: '10px', color: uploadMsg.includes('✅') ? 'green' : 'red' }}>{uploadMsg}</p>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}