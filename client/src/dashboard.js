import React, { useState, useEffect } from 'react';

function Dashboard({ onLogout, token }) {
  const email = localStorage.getItem('authenticatedEmail') || 'Tuntematon käyttäjä';

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);     
  const [error, setError] = useState(null);              
  const [uploadProgress, setUploadProgress] = useState(0);

//const API_URL = process.env.REACT_APP_API_URL || 'https://infotaulu-backend.up.railway.app';
  const API_URL = process.env.REACT_APP_API_URL || 'https://sprinfotaulu.fi';

  useEffect(() => {
    fetchFiles();
  }, [token]);   

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
    setError(null);
  };

  
  const handleSubmit = (e) => {
  e.preventDefault();

  if (!file) { setMessage('Valitse ensin tiedosto'); return; }
  if (!token) { setMessage('Kirjaudu ensin sisään'); return; }

  setIsUploading(true);
  setMessage('');
  setUploadProgress(0);
  setError(null);

  const formData = new FormData();
  formData.append('file', file);
  formData.append('uploadedBy', email);

  const xhr = new XMLHttpRequest();

  // Progress seuranta — tämä toimii toisin kuin fetch
  xhr.upload.addEventListener('progress', (event) => {
    if (event.lengthComputable) {
      const progress = Math.round((event.loaded / event.total) * 100);
      setUploadProgress(progress);
    }
  });

  xhr.addEventListener('load', () => {
    try {
      const data = JSON.parse(xhr.responseText);
      if (xhr.status === 401 || xhr.status === 403) {
        onLogout(); return;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        setMessage(`Onnistui! Tiedosto: ${data.file?.originalName || 'tiedosto'}`);
        setFile(null);
        fetchFiles();
      } else {
        throw new Error(data.error || 'Lataus epäonnistui');
      }
    } catch (err) {
      setMessage(`Virhe: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  });

  xhr.addEventListener('error', () => {
    setMessage('Verkkovirhe latauksen aikana');
    setIsUploading(false);
  });

  xhr.open('POST', `${API_URL}/api/upload`);
  xhr.setRequestHeader('Authorization', `Bearer ${token}`);
  xhr.send(formData);
};

  const fetchFiles = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      if (!res.ok) {
        throw new Error('Haku epäonnistui');
      }

      const data = await res.json();

      if (!Array.isArray(data)) {
        throw new Error('Palvelin palautti virheellisen datan');
      }

      setFiles(data);
      setMessage('');
    } catch (err) {
      console.error('Virhe tiedostojen haussa:', err);
      setError('Tiedostojen hakeminen epäonnistui. Yritä myöhemmin uudelleen.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haluatko varmasti poistaa tiedoston pysyvästi?')) return;

    try {
      const res = await fetch(`${API_URL}/api/upload/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          onLogout();
          return;
        }
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Poisto epäonnistui');
      }

      setMessage('Tiedosto poistettu onnistuneesti');
      fetchFiles();
    } catch (err) {
      setMessage(`Virhe poistossa: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <div className="two-column sidebar">

        <div className="guide">
          <div className="panel">
            <h2 className="panel-title">Ohjeet</h2>
              <ul>
                <li><strong>Lataa tiedostoja</strong> painamalla "Valitse tiedosto" -kenttää ja valitsemalla kuva tai video tietokoneeltasi.</li>
                <li><strong>Sallitut tiedostotyypit</strong>: vain JPG, PNG, MP4, PDF (max. koko ~50 Mt).</li>
                <li>Paina <strong>“Lataa”</strong>-nappia – tiedosto siirtyy palvelimelle.</li>
                <li>Onnistuessaan näet viestin “Onnistui! Tiedosto: [tiedostonimi]” ja tiedosto ilmestyy listaan heti.</li>
                <li>Tiedostot <strong>näkyvät infotaululla automaattisesti</strong> (Raspberry Pi -laitteella).</li>
                <li>Poistaaksesi tiedoston:
                    <ul style={{ marginTop: '0.5rem' }}>
                        <li>Klikkaa tiedoston rivillä olevaa <strong>“Poista”</strong>-nappia</li>
                        <li>Vahvista poistaminen ponnahdusikkunassa</li>
                        <li>Tiedosto katoaa listasta ja infotaululta</li>
                    </ul>
                </li>
              </ul>
          </div>
        </div>

        <div className="dashboard">
          <div className="panel">
            <h2 className="panel-title">Hallintapaneeli</h2>

              <form onSubmit={handleSubmit}>

                {/* Tiedostovalitsin ja nappi samalla rivillä */}
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <label style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    whiteSpace: 'nowrap'
                  }}>
                    Valitse tiedosto
                    <input
                      type="file"
                      accept="image/jpeg,image/png,video/mp4,application/pdf"
                      onChange={handleFileChange}
                      disabled={isUploading}
                      style={{ display: 'none' }}
                    />
                  </label>

                  {/* Tiedostonimi näkyy valitsimen vieressä */}
                  <span style={{
                    fontSize: '0.85rem',
                    color: '#555',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    maxWidth: '200px'
                  }}>
                    {file ? file.name : 'Ei tiedostoa valittu'}
                  </span>
                </div>

                <button
                  disabled={!file || isUploading}
                  style={{ width: '100%', marginBottom: '12px' }}
                >
                  {isUploading ? `Ladataan... ${uploadProgress}%` : 'Lataa'}
                </button>

                {/* Progress bar animaatiolla */}
                {isUploading && (
                  <div style={{ margin: '8px 0 16px 0' }}>

                    {/* Prosenttiluku ja tiedostokoko */}
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem',
                      color: '#555',
                      marginBottom: '6px'
                    }}>
                      <span>Ladataan palvelimelle...</span>
                      <span style={{ fontWeight: 'bold' }}>{uploadProgress}%</span>
                    </div>

                    {/* Progress bar tausta */}
                    <div style={{
                      width: '100%',
                      backgroundColor: '#e9ecef',
                      borderRadius: '8px',
                      height: '14px',
                      overflow: 'hidden',
                      boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                    }}>
                      {/* Animoitu täyttö */}
                      <div style={{
                        width: `${uploadProgress}%`,
                        height: '100%',
                        background: uploadProgress === 100
                          ? '#28a745'                          // vihreä kun valmis
                          : 'linear-gradient(90deg, #c0392b, #e74c3c)', // SPR punainen
                        borderRadius: '8px',
                        transition: 'width 0.4s ease',
                        position: 'relative',
                        overflow: 'hidden'
                      }}>
                        {/* Kiiltävä liike-efekti */}
                        <div style={{
                          position: 'absolute',
                          top: 0, left: '-100%',
                          width: '100%', height: '100%',
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                          animation: 'shimmer 1.5s infinite'
                        }}/>
                      </div>
                    </div>

                    {/* Vaiheviesti */}
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#888',
                      marginTop: '4px',
                      textAlign: 'center'
                    }}>
                      {uploadProgress < 30 && '⏳ Aloitetaan lataus...'}
                      {uploadProgress >= 30 && uploadProgress < 70 && '📤 Siirretään tiedostoa...'}
                      {uploadProgress >= 70 && uploadProgress < 100 && '🔄 Viimeistellään...'}
                      {uploadProgress === 100 && '✅ Valmis!'}
                    </p>
                  </div>
                )}

              </form>

            {message && (
              <p style={{ color: message.includes('Onnistui') ? 'green' : 'red' }}>
                {message}
              </p>
            )}

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Tiedostolista */}
            <table style={{ marginTop: '2rem', width: '100%' }}>
              <thead>
                <tr>
                  <th>Nimi</th>
                  <th>Lataaja</th>
                  <th>Päivä</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {files.map((f) => (
                  <tr key={f._id}>
                    <td>{f.originalName}</td>
                    <td>{f.uploadedBy}</td>
                    <td>{new Date(f.uploadedAt).toLocaleString()}</td>
                    <td>
                      <button
                        style={{ backgroundColor: '#ef4444', color: 'white' }}
                        onClick={() => handleDelete(f._id)}
                      >
                        Poista
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <p style={{ marginTop: '2rem' }}>
              Kirjautunut: <strong>{email}</strong>
            </p>

            <button
              onClick={onLogout}
              style={{ marginTop: '1rem', backgroundColor: '#444', color: 'white' }}
            >
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;