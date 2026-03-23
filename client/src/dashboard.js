import React, { useState, useEffect } from 'react';

function Dashboard({ onLogout }) {
  const email = localStorage.getItem('authenticatedEmail') || 'Tuntematon käyttäjä';

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL || 'https://infotaulu-backend.up.railway.app';

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage('Valitse ensin tiedosto');
      return;
    }

    setIsUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', email);

    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Lataus epäonnistui');
      }

      setMessage(`Onnistui! Tiedosto: ${data.file.originalName}`);
      setFile(null);
      fetchFiles();

    } catch (err) {
      setMessage(`Virhe: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };


    const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_URL}/api/upload`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error('Haku epäonnistui');
      const data = await res.json();
      setFiles(data);
    } catch (err) {
      console.error('Tiedostojen haku epäonnistui:', err);
      setMessage('Virhe tiedostojen haussa');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Haluatko varmasti poistaa tiedoston pysyvästi?')) return;

    try {
      const res = await fetch(`${API_URL}/api/upload/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'Poisto epäonnistui');
      }

      setMessage('Tiedosto poistettu onnistuneesti');
      fetchFiles(); // Päivitä lista
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
              <li>Vain JPG, PNG ja MP4</li>
              <li>Tiedostot näkyvät infotaululla automaattisesti</li>
            </ul>
          </div>
        </div>

        <div className="dashboard">
          <div className="panel">
            <h2 className="panel-title">Hallintapaneeli</h2>

            <form onSubmit={handleSubmit}>
              <input
                type="file"
                accept="image/jpeg,image/png,video/mp4"
                onChange={handleFileChange}
                disabled={isUploading}
              />
              <button disabled={!file || isUploading}>
                {isUploading ? 'Ladataan...' : 'Lataa'}
              </button>
            </form>

            {message && (
              <p style={{ color: message.includes('Onnistui') ? 'green' : 'red' }}>
                {message}
              </p>
            )}

            {/* 📂 Tiedostolista */}
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
