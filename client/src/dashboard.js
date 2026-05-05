import React, { useState, useEffect } from 'react';

function Dashboard({ onLogout, token }) {
  const email = localStorage.getItem('authenticatedEmail') || 'Tuntematon käyttäjä';

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const API_URL = process.env.REACT_APP_API_URL || 'https://sprinfotaulu.fi';

  // Haetaan tiedostot komponentin ladatessa
  useEffect(() => {
    if (token) fetchFiles();
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
    setError(null);
    setUploadProgress(0);
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

    // XMLHttpRequest progress baria varten
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
        setMessage('✅ Tiedosto ladattu onnistuneesti!');
        setFile(null);
        setUploadProgress(0);
        fetchFiles();
      } else {
        setError('Lataus epäonnistui');
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
      throw new Error(errorData.error || 'Lataus epäonnistui');
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

  return (
    <div className="App">
      <div className="two-column">

        {/* OHJEPANEELI */}
        <div className="guide">
          <div className="panel">
            <h2 className="panel-title">Ohjeet</h2>
              <ul>
                <li><strong>Lataa tiedostoja</strong> painamalla "Valitse tiedosto" -kenttää ja valitsemalla kuva tai video tietokoneeltasi.</li>
                <li><strong>Sallitut tiedostotyypit</strong>: vain JPG, PNG ja MP4 (max. koko ~50 Mt).</li>
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

            {/* Progress Bar */}
            {isUploading && (
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <div className="progress-text">
                  Ladataan... {uploadProgress}%
                </div>
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {files.map((f) => (
                <tr key={f._id}>
<td>
  <button 
    className="file-link"
    onClick={() => handleDownload(f._id, f.originalName)}
  >
    {f.originalName}
  </button>
</td>
                  <td>{f.uploadedBy}</td>
                  <td>{new Date(f.uploadedAt).toLocaleString('fi-FI')}</td>
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