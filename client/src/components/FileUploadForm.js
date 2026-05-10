import React from 'react';

export default function FileUploadForm({
  file,
  expiresAt,
  setExpiresAt,
  isUploading,
  uploadProgress,
  message,
  error,
  onFileChange,
  onSubmit,
  previewUrl,
  previewType,
  onClosePreview,
}) {
  return (
    <>
      <form onSubmit={onSubmit} className="upload-form">
        <div className="file-input-wrapper">
          <input
            type="file"
            id="file-upload"
            accept="image/jpeg,image/png,video/mp4,application/pdf"
            onChange={onFileChange}
            disabled={isUploading}
          />
          <label htmlFor="file-upload" className="file-label">
            {file ? file.name : 'Valitse tiedosto tietokoneelta'}
          </label>
        </div>

        <button
          type="submit"
          className="upload-button"
          disabled={!file || isUploading}
        >
          {isUploading ? 'Ladataan...' : 'Lataa tiedosto'}
        </button>

        {file && (
          <div style={{ marginTop: '8px' }}>
            <label style={{
              fontSize: '0.85rem',
              color: '#475569',
              display: 'block',
              marginBottom: '4px'
            }}>
              Poistuu automaattisesti (valinnainen):
            </label>
            <input
              type="date"
              value={expiresAt}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setExpiresAt(e.target.value)}
              style={{
                width: '100%', padding: '8px 10px',
                border: '1px solid #e2e8f0', borderRadius: '6px',
                fontSize: '0.9rem',
                color: expiresAt ? '#1e293b' : '#94a3b8'
              }}
            />
            {expiresAt && (
              <button
                type="button"
                onClick={() => setExpiresAt('')}
                style={{
                  marginTop: '4px', background: 'none', border: 'none',
                  color: '#94a3b8', fontSize: '0.8rem',
                  cursor: 'pointer', padding: '2px 0', width: 'auto'
                }}
              >
                ✕ Poista päivämäärä
              </button>
            )}
          </div>
        )}
      </form>

      {previewUrl && (
        <div style={{ marginTop: '16px' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between',
            alignItems: 'center', marginBottom: '8px'
          }}>
            <p style={{ fontWeight: 'bold', fontSize: '0.9rem', color: '#333', margin: 0 }}>
              Esikatselu — infotaulun näkymä
            </p>
            <button
              onClick={onClosePreview}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: '1.2rem', color: '#999', padding: '0 4px'
              }}
              title="Sulje esikatselu"
            >
              ✕
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{
              width: '180px', height: '320px',
              border: '3px solid #222', borderRadius: '8px',
              overflow: 'hidden', backgroundColor: '#000',
              position: 'relative', boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
            }}>
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                height: '4px', backgroundColor: '#111', zIndex: 2
              }}/>
              {previewType === 'image' && (
                <img src={previewUrl} alt="Esikatselu" style={{
                  width: '100%', height: '100%',
                  objectFit: 'contain', backgroundColor: '#000'
                }}/>
              )}
              {previewType === 'video' && (
                <video src={previewUrl} controls muted style={{
                  width: '100%', height: '100%',
                  objectFit: 'contain', backgroundColor: '#000'
                }}/>
              )}
              {previewType === 'pdf' && (
                <div style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  height: '100%', color: '#fff', gap: '8px'
                }}>
                  <span style={{ fontSize: '2.5rem' }}>📄</span>
                  <span style={{ fontSize: '0.7rem', textAlign: 'center', padding: '0 8px' }}>
                    {file?.name}
                  </span>
                  <span style={{ fontSize: '0.65rem', color: '#aaa' }}>PDF-tiedosto</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ textAlign: 'center', marginTop: '8px', fontSize: '0.75rem', color: '#666' }}>
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
    </>
  );
}