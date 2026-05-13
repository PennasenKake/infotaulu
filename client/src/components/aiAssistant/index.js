// client/src/components/AIAssistant/index.js
import React, { useState } from 'react';
import { generateBrandedHTML } from './utils/generateHTML';
import './aiAssistant.css';

export default function AiAssistant({ token, apiUrl, onUploadSuccess }) {
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

  const handleDownloadImage = async () => {
  if (!result) return;

  const html = generateBrandedHTML({ ...result, template });

  // Luodaan piilotettu container johon HTML renderöidään
  const container = document.createElement('div');
  container.style.cssText = [
    'position:fixed',
    'left:-9999px',
    'top:0',
    'width:1080px',
    'height:1920px',
    'overflow:hidden',
    'background:#000',
  ].join(';');

  // Kirjoitetaan HTML iframe:n sijaan suoraan shadowRoot-trikkiä käyttäen
  const iframe = document.createElement('iframe');
  iframe.style.cssText = 'width:1080px;height:1920px;border:none';
  container.appendChild(iframe);
  document.body.appendChild(container);

  // Odotetaan että iframe latautuu
  await new Promise((resolve) => {
    iframe.onload = resolve;
    iframe.srcdoc = html;
  });

  // Pieni viive fonttien latautumiselle
  await new Promise(r => setTimeout(r, 800));

  try {
    const canvas = await html2canvas(iframe.contentDocument.body, {
      width:   1080,
      height:  1920,
      scale:   1,
      useCORS: true,
      allowTaint: true,
      backgroundColor: null,
    });

    const a = document.createElement('a');
    a.href     = canvas.toDataURL('image/png');
    a.download = `spr_nilsia_${Date.now()}.png`;
    a.click();
  } catch (err) {
    console.error('html2canvas virhe:', err);
    // Fallback: lataa HTML jos kuvakaappaus epäonnistuu
    handleDownloadHTML();
  } finally {
    document.body.removeChild(container);
  }
};
  
return (
    <div className="ai-assistant">
      <button
        onClick={() => setOpen(o => !o)}
        className="ai-toggle-btn"
      >
        <span>✨ AI-sisältöapuri</span>
        <span>{open ? '▲ Sulje' : '▼ Avaa'}</span>
      </button>

      {open && (
        <div className="ai-panel">
          <label className="ai-label">Kuvaile sisältö suomeksi:</label>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Esim: Ensiapukurssi järjestetään 15.10. Nilsiän palotalolla klo 18-21..."
            rows={4}
            className="ai-textarea"
          />

          <div className="ai-examples">
            {ESIMERKIT.map((ex, i) => (
              <button key={i} onClick={() => setPrompt(ex)} className="ai-example-btn">
                {ex}
              </button>
            ))}
          </div>

          <button 
            onClick={handleGenerate}
            disabled={loading || !prompt.trim()}
            className="ai-generate-btn"
          >
            {loading ? '⏳ Generoidaan...' : '✨ Luo sisältö'}
          </button>

          {error && <p className="ai-error">{error}</p>}

          {result && (
            <div className="ai-result">
              <div className="ai-result-fields">
                <label>Otsikko</label>
                <input 
                  value={result.otsikko} 
                  onChange={e => setResult(r => ({...r, otsikko: e.target.value}))} 
                />

                <label>Sisältö</label>
                <textarea 
                  value={result.sisalto} 
                  onChange={e => setResult(r => ({...r, sisalto: e.target.value}))} 
                  rows={5}
                />

                <label>Kehotus (valinnainen)</label>
                <input 
                  value={result.kehotus} 
                  onChange={e => setResult(r => ({...r, kehotus: e.target.value}))} 
                />
              </div>

              <div className="ai-template-selector">
                <p>Valitse pohja</p>
                <div className="ai-templates">
                  {TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setTemplate(t.id)}
                      className={`ai-template-btn ${template === t.id ? 'active' : ''}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              
            <div className="ai-actions">
            <button onClick={handleUpload} disabled={uploading}
                style={{ flex: 2, padding: '11px',
                background: uploading ? '#94a3b8' : '#16a34a',
                color: '#fff', border: 'none', borderRadius: '8px',
                fontSize: '0.88rem', fontWeight: '700',
                cursor: uploading ? 'not-allowed' : 'pointer', width: 'auto' }}>
                {uploading ? '⏳ Ladataan...' : '⬆ Lisää infotaululle'}
            </button>

            {/* ✅ Lataa PNG */}
            <button onClick={handleDownloadImage}
                style={{ flex: 1, padding: '11px',
                background: '#f1f5f9', color: '#475569',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                fontSize: '0.85rem', fontWeight: '600',
                cursor: 'pointer', width: 'auto' }}
                title="Lataa 1080×1920 px PNG-kuvana">
                🖼 PNG
            </button>

            {/* Uusi generointi */}
            <button onClick={() => { setResult(null); setUploadMsg(''); setError(''); }}
                title="Uusi generointi"
                style={{ padding: '11px 14px', background: '#fff', color: '#94a3b8',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                fontSize: '0.88rem', cursor: 'pointer', width: 'auto' }}>
                ↺
            </button>
            </div>

              {uploadMsg && (
                <p className={`ai-upload-msg ${uploadMsg.includes('✅') ? 'success' : 'error'}`}>
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
