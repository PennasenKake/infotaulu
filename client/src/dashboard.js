import React, { useState, useEffect } from 'react';

function Dashboard({ onLogout, token }) {
  const email = localStorage.getItem('authenticatedEmail') || 'Tuntematon käyttäjä';

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null); // 'image', 'video', 'pdf'

  const [storageStats, setStorageStats] = useState(null);

  const [deviceStatus, setDeviceStatus] = useState(null);


  const API_URL = process.env.REACT_APP_API_URL || 'https://sprinfotaulu.fi';

  useEffect(() => {
    if (token) {
      fetchFiles();
      fetchStorageStats();
      fetchDeviceStatus();
      const interval = setInterval(fetchDeviceStatus, 30000); 
      return () => clearInterval(interval);
    }
  }, [token]);


  const fetchStorageStats = async () => {
  try {
    const res = await fetch(`${API_URL}/api/upload/storage/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.ok) {
      const data = await res.json();
      setStorageStats(data);
    }
  } catch (err) {
    console.error('Storage stats fetch failed:', err);
  }
};


const handleFileChange = (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  setFile(selectedFile);
  setMessage('');
  setError(null);
  setUploadProgress(0);

  // Määritä tiedostotyyppi esikatselua varten
  if (selectedFile.type.startsWith('image/')) {
    setPreviewType('image');
  } else if (selectedFile.type === 'video/mp4') {
    setPreviewType('video');
  } else if (selectedFile.type === 'application/pdf') {
    setPreviewType('pdf');
  }

  // Lue tiedosto paikallisesti — ei palvelinpyyntöä
  const reader = new FileReader();
  reader.onload = (event) => {
    setPreviewUrl(event.target.result);
  };
  reader.readAsDataURL(selectedFile);
};

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Valitse ensin tiedosto');
      return;
    }
    if (!token) {
      setMessage('Kirjaudu ensin sisään');
      return;
    }

    setIsUploading(true);
    setMessage('');
    setError(null);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', email);

    const xhr = new XMLHttpRequest();

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setUploadProgress(percent);
      }
    };

    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200 || xhr.status === 201) {
        setUploadProgress(100); // näytä 100% hetki
        setTimeout(() => setUploadProgress(0), 1000); // nollaa sekunnin kuluttua
        setMessage('✅ Tiedosto ladattu onnistuneesti!');
        setFile(null);
        setPreviewUrl(null);   // tyhjennä esikatselu
        setPreviewType(null);        
        fetchFiles();
        fetchStorageStats();
      } else {
        setError('Lataus epäonnistui');
        setUploadProgress(0);
      }
    };

    xhr.onerror = () => {
      setIsUploading(false);
      setError('Yhteysvirhe palvelimeen');
    };

    xhr.open('POST', `${API_URL}/api/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  };

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Virhe tiedostojen haussa:', err);
      setError('Tiedostojen haku epäonnistui');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haluatko varmasti poistaa tiedoston pysyvästi?')) return;

    try {
      const res = await fetch(`${API_URL}/api/upload/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Poisto epäonnistui');

      setMessage('Tiedosto poistettu onnistuneesti');
      fetchFiles();
      fetchStorageStats();
    } catch (err) {
      setError(`Poistovirhe: ${err.message}`);
    }
  };

  const handleDownload = async (id, originalName) => {
    try {
      const res = await fetch(`${API_URL}/api/upload/download/${id}`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Palvelinvirhe (${res.status})`);
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = originalName || 'tiedosto';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setMessage(`Ladataan: ${originalName}`);
    } catch (err) {
      console.error(err);
      setError(`Lataus epäonnistui: ${err.message}`);
    }
  };

  const handleToggle = async (id, currentState) => {
    try {
      const res = await fetch(`${API_URL}/api/upload/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Tilan vaihto epäonnistui');
      
      setFiles(prev => prev.map(f =>
        f._id === id ? { ...f, isActive: !f.isActive } : f
      ));
    } catch (err) {
      setError(`Virhe: ${err.message}`);
    }
  };


  const handleDisplayTimeChange = async (id, seconds) => {
    const value = parseInt(seconds);
    if (isNaN(value) || value < 5 || value > 600) return;

    try {
      const res = await fetch(`${API_URL}/api/upload/${id}/display-time`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ displaySeconds: value })
      });

      if (!res.ok) throw new Error('Päivitys epäonnistui');

      setFiles(prev => prev.map(f =>
        f._id === id ? { ...f, displaySeconds: value } : f
      ));
    } catch (err) {
      setError(`Virhe: ${err.message}`);
    }
  };  

  const fetchDeviceStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/heartbeat/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDeviceStatus(data);
      }
    } catch (err) {
      console.error('Device status fetch failed:', err);
    }
  };

  return (
    <div className="App">
      <div className="two-column">

        {/* OHJEPANEELI */}
        <div className="guide">
          <div className="panel">
            <h2 className="panel-title">Ohjeet</h2>

          {/* Laitteen tila */}
          {deviceStatus && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: deviceStatus.online ? '#f0fff4' : '#fff5f5',
              border: `1px solid ${deviceStatus.online ? '#22c55e' : '#ef4444'}`,
              borderRadius: '8px',
              marginTop: '1rem',
              marginBottom: '0.5rem'
            }}>
              {/* Vilkkuva piste */}
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: deviceStatus.online ? '#22c55e' : '#ef4444',
                animation: deviceStatus.online ? 'pulse 2s infinite' : 'none',
                flexShrink: 0
              }}/>

              <div style={{ flex: 1 }}>
                <strong style={{ 
                  color: deviceStatus.online ? '#15803d' : '#b91c1c',
                  fontSize: '0.9rem'
                }}>
                  Infotaulu: {deviceStatus.online ? '🟢 Online' : '🔴 Offline'}
                </strong>

                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                  {deviceStatus.lastSeen ? (
                    <>
                      Viimeksi nähty:{' '}
                      {new Date(deviceStatus.lastSeen).toLocaleString('fi-FI')}
                      {deviceStatus.syncedFiles > 0 && (
                        <> · {deviceStatus.syncedFiles} tiedostoa</>
                      )}
                    </>
                  ) : (
                    'Laitetta ei ole vielä yhdistetty'
                  )}
                </div>
              </div>
            </div>
          )}

          <br />

            {/* Levytilan seuranta */}
            {storageStats && (
              <div style={{ marginBottom: '1rem' }}>

                {/* Otsikkorivi */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px'
                }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    color: '#475569'
                  }}>
                    💾 Tallennustila
                  </span>
                  <span style={{
                    fontSize: '0.8rem',
                    color: storageStats.usedPercent > 80 ? '#dc2626' :
                          storageStats.usedPercent > 60 ? '#d97706' : '#64748b'
                  }}>
                    {storageStats.usedMB} Mt / {storageStats.totalMB} Mt
                  </span>
                </div>

                {/* Progress bar */}
                <div style={{
                  height: '10px',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${storageStats.usedPercent}%`,
                    height: '100%',
                    borderRadius: '9999px',
                    transition: 'width 0.5s ease',
                    background:
                      storageStats.usedPercent > 80
                        ? '#dc2626'                                    // punainen — täynnä
                        : storageStats.usedPercent > 60
                        ? 'linear-gradient(90deg, #f59e0b, #d97706)'  // oranssi — varoitus
                        : 'linear-gradient(90deg, #22c55e, #16a34a)'  // vihreä — ok
                  }}/>
                </div>

                {/* Varoitusviesti */}
                {storageStats.usedPercent > 80 && (
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#dc2626',
                    marginTop: '4px',
                    marginBottom: 0
                  }}>
                    ⚠️ Tallennustila on lähes täynnä — poista vanhoja tiedostoja
                  </p>
                )}
              </div>
            )}

              <br />

              <ul>
                <li>
                  <strong>Lataa tiedostoja</strong> painamalla "Valitse tiedosto" 
                  -kenttää ja valitsemalla tiedosto tietokoneeltasi. Esikatselu 
                  näyttää miltä tiedosto näyttää infotaululla ennen latausta.
                </li>

                <li>
                  <strong>Sallitut tiedostotyypit</strong>: JPG, PNG, MP4 ja PDF 
                  (max. koko 50 Mt).
                </li>

                <li>
                  Paina <strong>"Lataa tiedosto"</strong> -nappia – latauksen 
                  eteneminen näkyy edistymispalkissa. Tiedosto ilmestyy listaan 
                  heti latauksen jälkeen.
                </li>

                <li>
                  Tiedostot <strong>näkyvät infotaululla automaattisesti </strong> 
                  muutaman minuutin sisällä (Raspberry Pi -laitteella).
                </li>

                <li>
                  <strong>Esitysaika</strong> — muuta tiedoston rivillä olevaa 
                  lukua (sekunteina) ja paina Enter. Oletusaika on 8 sekuntia. 
                  Videot toistuvat aina loppuun asti riippumatta asetetusta ajasta.
                </li>

                <li>
                  <strong>Piilota / Näytä</strong> — ⏸-nappi piilottaa tiedoston 
                  esityksestä poistamatta sitä järjestelmästä. ▶-nappi tuo sen 
                  takaisin. Piilotettu tiedosto näkyy listassa himmennettynä.
                </li>

                <li>
                  <strong>Lataa tiedosto omalle koneelle</strong> — klikkaa 
                  tiedostonimeä listassa ladataksesi alkuperäisen tiedoston.
                </li>

                <li>
                  <strong>Poista tiedosto</strong> pysyvästi painamalla 
                  <strong> "Poista"</strong>-nappia ja vahvistamalla poistaminen. 
                  Tiedosto häviää listasta ja infotaululta seuraavan 
                  synkronoinnin jälkeen.
                </li>
              </ul>

          </div>
        </div>

        {/* HALLINTAPANEELI */}
        <div className="dashboard">
          <div className="panel">
            <h2 className="panel-title">Hallintapaneeli</h2>

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  id="file-upload"
                  accept="image/jpeg,image/png,video/mp4,application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
                <label htmlFor="file-upload" className="file-label">
                  {file ? file.name : "Valitse tiedosto tietokoneelta"}
                </label>
              </div>

              <button 
                type="submit" 
                className="upload-button"
                disabled={!file || isUploading}
              >
                {isUploading ? 'Ladataan...' : 'Lataa tiedosto'}
              </button>
            </form>

          {/* Esikatselu */}
          {previewUrl && (
            <div style={{ marginTop: '16px' }}>
              
              {/* Otsikkorivi */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <p style={{ 
                  fontWeight: 'bold', 
                  fontSize: '0.9rem',
                  color: '#333',
                  margin: 0
                }}>
                  Esikatselu — infotaulun näkymä
                </p>
                <button
                  onClick={() => { setPreviewUrl(null); setPreviewType(null); setFile(null); }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1.2rem',
                    color: '#999',
                    padding: '0 4px'
                  }}
                  title="Sulje esikatselu"
                >
                  ✕
                </button>
              </div>

              {/* RPI-näyttöä simuloiva kehys — pystysuunta */}
              <div style={{
                display: 'flex',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '180px',
                  height: '320px',          // 9:16 kuvasuhde kuten RPI-näyttö
                  border: '3px solid #222',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  position: 'relative',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                }}>
                  
                  {/* Pieni näyttöpalkki ylös — simuloi TV:n reunaa */}
                  <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0,
                    height: '4px',
                    backgroundColor: '#111',
                    zIndex: 2
                  }}/>

                  {/* Kuva */}
                  {previewType === 'image' && (
                    <img
                      src={previewUrl}
                      alt="Esikatselu"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#000'
                      }}
                    />
                  )}

                  {/* Video */}
                  {previewType === 'video' && (
                    <video
                      src={previewUrl}
                      controls
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#000'
                      }}
                    />
                  )}

                  {/* PDF — näytetään ikoni koska PDF vaatii pdf.js */}
                  {previewType === 'pdf' && (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '100%',
                      color: '#fff',
                      gap: '8px'
                    }}>
                      <span style={{ fontSize: '2.5rem' }}>📄</span>
                      <span style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0 8px' }}>
                        {file?.name}
                      </span>
                      <span style={{ fontSize: '0.65rem', color: '#aaa' }}>
                        PDF-tiedosto
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Tiedoston perustiedot kehyksen alla */}
              <div style={{
                textAlign: 'center',
                marginTop: '8px',
                fontSize: '0.75rem',
                color: '#666'
              }}>
                <span>{file?.name}</span>
                <span style={{ margin: '0 6px' }}>·</span>
                <span>{file ? (file.size / 1024 / 1024).toFixed(2) + ' Mt' : ''}</span>
              </div>
            </div>
          )}            

            {isUploading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${uploadProgress}%` }} />
                </div>
                <div className="progress-text">Ladataan... {uploadProgress}%</div>
              </div>
            )}

            {message && <p className="success">{message}</p>}
            {error && <p className="error">{error}</p>}

            {/* Tiedostolista */}
            <table className="file-table">
            <thead>
              <tr>
                <th>Nimi</th>
                <th>Lataaja</th>
                <th>Päivä</th>
                <th>Aika | Tila</th>
                <th>Poista</th>
              </tr>
            </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f._id} style={{ 
                    opacity: f.isActive === false ? 0.45 : 1,
                    transition: 'opacity 0.2s ease'
                  }}>
                    <td>
                      <button
                        className="file-download-link"
                        onClick={() => handleDownload(f._id, f.originalName)}
                        style={{ 
                          textDecoration: f.isActive === false ? 'line-through' : 'none',
                          color: f.isActive === false ? '#94a3b8' : '#2563eb'
                        }}
                      >
                        {f.originalName}
                      </button>
                    </td>

                    <td style={{ fontSize: '1rem', color: '#000000' }}>
                      {f.uploadedBy.split('@')[0]}
                    </td>

                    <td style={{ fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                      {new Date(f.uploadedAt).toLocaleDateString('fi-FI', { 
                        day: 'numeric', month: 'numeric' 
                      })}{' '}
                      {new Date(f.uploadedAt).toLocaleTimeString('fi-FI', { 
                        hour: '2-digit', minute: '2-digit' 
                      })}
                    </td>     

                    <td>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '6px',
                        whiteSpace: 'nowrap'
                      }}>
                        <input 
                          type="number" 
                          min="5" 
                          max="600"
                          defaultValue={f.displaySeconds || 8}
                          onBlur={(e) => handleDisplayTimeChange(f._id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              handleDisplayTimeChange(f._id, e.target.value);
                              e.target.blur();
                            }
                          }}
                          style={{ 
                            width: '52px', 
                            padding: '4px 4px', 
                            border: '1px solid #e2e8f0', 
                            borderRadius: '4px', 
                            fontSize: '0.92rem', 
                            textAlign: 'center'
                          }}
                        />
                        <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>s</span>

                        {/* Erotin */}
                        <span style={{ color: '#cbd5e1', fontSize: '0.9rem' }}>|</span>

                        <button
                          className="toggle-btn"
                          onClick={() => handleToggle(f._id, f.isActive)}
                          title={f.isActive === false ? 'Aktivoi esitykseen' : 'Piilota esityksestä'}
                        >
                          {f.isActive === false ? '▶ Näytä' : '⏸ Piilota'}
                        </button>
                      </div>
                    </td>

                    
                    <td>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(f._id)}
                      >
                        Poista
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: '1.5rem' }}>
              Kirjautuneena: <strong>{email}</strong>
            </p>

            <button className="logout-btn" onClick={onLogout}>
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;