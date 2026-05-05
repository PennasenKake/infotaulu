import React, { useState, useEffect } from 'react';

function Dashboard({ onLogout, token }) {
  const email = localStorage.getItem('authenticatedEmail') || 'Tuntematon käyttäjä';

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://sprinfotaulu.fi';

  useEffect(() => {
    fetchFiles();
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setMessage('');
    setError('');
    setUploadProgress(0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setError('Valitse ensin tiedosto');
      return;
    }
    if (!token) {
      setError('Kirjaudu ensin sisään');
      return;
    }

    setIsUploading(true);
    setMessage('');
    setError('');
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
      if (xhr.status === 200 || xhr.status === 201) {
        setMessage(`Onnistui! Tiedosto: ${file.name}`);
        setFile(null);
        setUploadProgress(0);
        fetchFiles();
      } else {
        const response = JSON.parse(xhr.responseText || '{}');
        setError(response.error || 'Lataus epäonnistui');
      }
      setIsUploading(false);
    };

    xhr.onerror = () => {
      setError('Virhe yhteydessä palvelimeen');
      setIsUploading(false);
    };

    xhr.open('POST', `${API_URL}/api/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
  };

  const fetchFiles = async () => {
    if (!token) return;
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.status === 401 || res.status === 403) {
        onLogout();
        return;
      }

      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (err) {
      setError('Tiedostojen haku epäonnistui');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haluatko varmasti poistaa tiedoston pysyvästi?')) return;

    try {
      const res = await fetch(`${API_URL}/api/upload/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (!res.ok) throw new Error('Poisto epäonnistui');

      setMessage('Tiedosto poistettu onnistuneesti');
      fetchFiles();
    } catch (err) {
      setError(`Virhe poistossa: ${err.message}`);
    }
  };

  return (
    <div className="App">
      <div className="two-column sidebar">

        {/* Ohjeet */}
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

        {/* Hallintapaneeli */}
        <div className="dashboard">
          <div className="panel">
            <h2 className="panel-title">Hallintapaneeli</h2>

            <form onSubmit={handleSubmit} className="upload-form">
              <div className="file-input-wrapper">
                <input
                  type="file"
                  accept="image/jpeg,image/png,video/mp4,application/pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  id="fileInput"
                />
                <label htmlFor="fileInput" className="file-label">
                  {file ? file.name : 'Valitse tiedosto...'}
                </label>
              </div>

              <button 
                type="submit" 
                disabled={!file || isUploading}
                className="upload-button"
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
                <span className="progress-text">{uploadProgress}%</span>
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
                    <td>{f.originalName}</td>
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

            <p style={{ marginTop: '2rem' }}>
              Kirjautunut: <strong>{email}</strong>
            </p>

            <button onClick={onLogout} className="logout-btn">
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;