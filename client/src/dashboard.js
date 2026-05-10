import React, { useState, useEffect } from 'react';
import DeviceStatus from './components/DeviceStatus';
import StorageBar from './components/StorageBar';
import FileUploadForm from './components/FileUploadForm';
import FileTable from './components/FileTable';

function Dashboard({ onLogout, token }) {
  const email = localStorage.getItem('authenticatedEmail') || 'Tuntematon käyttäjä';
  const API_URL = process.env.REACT_APP_API_URL || 'https://sprinfotaulu.fi';

  const [file, setFile] = useState(null);
  const [files, setFiles] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [storageStats, setStorageStats] = useState(null);
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [expiresAt, setExpiresAt] = useState('');

  useEffect(() => {
    if (!token) return;
    fetchFiles();
    fetchStorageStats();
    fetchDeviceStatus();
    const interval = setInterval(fetchDeviceStatus, 30000);
    return () => clearInterval(interval);
  }, [token]);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`${API_URL}/api/upload`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.status === 401 || res.status === 403) { onLogout(); return; }
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch {
      setError('Tiedostojen haku epäonnistui');
    }
  };

  const fetchStorageStats = async () => {
    try {
      const res = await fetch(`${API_URL}/api/upload/storage/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setStorageStats(await res.json());
    } catch { /* hiljainen virhe */ }
  };

  const fetchDeviceStatus = async () => {
    try {
      const res = await fetch(`${API_URL}/api/heartbeat/status`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) setDeviceStatus(await res.json());
    } catch { /* hiljainen virhe */ }
  };

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;
    setFile(selected);
    setMessage('');
    setError(null);
    setUploadProgress(0);
    if (selected.type.startsWith('image/')) setPreviewType('image');
    else if (selected.type === 'video/mp4') setPreviewType('video');
    else if (selected.type === 'application/pdf') setPreviewType('pdf');
    const reader = new FileReader();
    reader.onload = (e) => setPreviewUrl(e.target.result);
    reader.readAsDataURL(selected);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !token) return;
    setIsUploading(true);
    setMessage('');
    setError(null);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('uploadedBy', email);
    if (expiresAt) formData.append('expiresAt', expiresAt);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable)
        setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      setIsUploading(false);
      if (xhr.status === 200 || xhr.status === 201) {
        setMessage('✅ Tiedosto ladattu onnistuneesti!');
        setFile(null); setPreviewUrl(null);
        setPreviewType(null); setExpiresAt('');
        setTimeout(() => setUploadProgress(0), 1000);
        fetchFiles(); fetchStorageStats();
      } else {
        setError('Lataus epäonnistui');
        setUploadProgress(0);
      }
    };
    xhr.onerror = () => { setIsUploading(false); setError('Yhteysvirhe palvelimeen'); };
    xhr.open('POST', `${API_URL}/api/upload`);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.send(formData);
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
      fetchFiles(); fetchStorageStats();
    } catch (err) { setError(`Poistovirhe: ${err.message}`); }
  };

  const handleDownload = async (id, originalName) => {
    try {
      const res = await fetch(`${API_URL}/api/upload/download/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(`Palvelinvirhe (${res.status})`);
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = originalName || 'tiedosto';
      document.body.appendChild(a); a.click(); a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) { setError(`Lataus epäonnistui: ${err.message}`); }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/upload/${id}/toggle`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Tilan vaihto epäonnistui');
      setFiles(prev => prev.map(f =>
        f._id === id ? { ...f, isActive: !f.isActive } : f
      ));
    } catch (err) { setError(`Virhe: ${err.message}`); }
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
    } catch (err) { setError(`Virhe: ${err.message}`); }
  };

    return (
    <div className="App">
      <div className="two-column">

        {/* OHJEPANEELI */}
        <div className="guide">
          <div className="panel">
            <h2 className="panel-title">Ohjeet</h2>
            <DeviceStatus deviceStatus={deviceStatus} />
            <br />
            <StorageBar storageStats={storageStats} />
            
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
                Tiedostot <strong>näkyvät infotaululla automaattisesti</strong>
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
            
            <br />

          </div>
        </div>

        {/* HALLINTAPANEELI */}
        <div className="dashboard">
          <div className="panel">
            <h2 className="panel-title">Hallintapaneeli</h2>
            <FileUploadForm
              file={file}
              expiresAt={expiresAt}
              setExpiresAt={setExpiresAt}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
              message={message}
              error={error}
              onFileChange={handleFileChange}
              onSubmit={handleSubmit}
              previewUrl={previewUrl}
              previewType={previewType}
              onClosePreview={() => {
                setPreviewUrl(null);
                setPreviewType(null);
                setFile(null);
              }}
            />
            <FileTable
              files={files}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onToggle={handleToggle}
              onDisplayTimeChange={handleDisplayTimeChange}
            />
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