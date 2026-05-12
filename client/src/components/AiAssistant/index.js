// client/src/components/AIAssistant/index.js
import React, { useState } from 'react';
import { generateBrandedHTML } from './utils/generateHTML';

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
    <div style={{ border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', marginBottom: '16px' }}>
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
          <label style={{ fontSize: '0.85rem', color: '#475569', fontWeight: '600', display: 'block', marginBottom: '8px' }}>
            Kuvaile sisältö suomeksi:
          </label>

          <textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Esim: Ensiapukurssi järjestetään 15.10. Nilsiän palotalolla klo 18-21..."
            rows={4}
            style={{ width: '100%', padding: '12px', border: '2px solid #e2e8f0', borderRadius: '8px', fontSize: '0.95rem', resize: 'vertical' }}
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '10px 0 14px' }}>
            {ESIMERKIT.map((ex, i) => (
              <button key={i} onClick={() => setPrompt(ex)} style={{
                padding: '5px 12px', fontSize: '0.78rem', background: '#f1f5f9',
                border: '1px solid #e2e8f0', borderRadius: '20px', cursor: 'pointer'
              }}>
                {ex}
              </button>
            ))}
          </div>

          <button onClick={handleGenerate} disabled={loading || !prompt.trim()} style={{
            width: '100%', padding: '12px', marginBottom: '12px',
            background: loading || !prompt.trim() ? '#94a3b8' : '#e30613',
            color: 'white', border: 'none', borderRadius: '8px', fontWeight: '700'
          }}>
            {loading ? '⏳ Generoidaan...' : '✨ Luo sisältö'}
          </button>

          {error && <p style={{ color: '#dc2626' }}>{error}</p>}

          {result && (
            <div style={{ marginTop: '16px' }}>
              <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', marginBottom: '12px' }}>
                <label>Otsikko</label>
                <input value={result.otsikko} onChange={e => setResult(r => ({...r, otsikko: e.target.value}))} style={{width:'100%', marginBottom:'10px'}} />

                <label>Sisältö</label>
                <textarea value={result.sisalto} onChange={e => setResult(r => ({...r, sisalto: e.target.value}))} rows={4} style={{width:'100%', marginBottom:'10px'}} />

                <label>Kehotus (valinnainen)</label>
                <input value={result.kehotus} onChange={e => setResult(r => ({...r, kehotus: e.target.value}))} style={{width:'100%'}} />
              </div>

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