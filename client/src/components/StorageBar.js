import React from 'react';

export default function StorageBar({ storageStats }) {
  if (!storageStats) return null;

  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '6px'
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#475569' }}>
          💾 Tallennustila
        </span>
        <span style={{
          fontSize: '0.8rem',
          color: storageStats.usedPercent > 80 ? '#dc2626'
               : storageStats.usedPercent > 60 ? '#d97706'
               : '#64748b'
        }}>
          {storageStats.usedMB} Mt / {storageStats.totalMB} Mt
        </span>
      </div>

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
            storageStats.usedPercent > 80 ? '#dc2626'
          : storageStats.usedPercent > 60 ? 'linear-gradient(90deg, #f59e0b, #d97706)'
          : 'linear-gradient(90deg, #22c55e, #16a34a)'
        }}/>
      </div>

      {storageStats.usedPercent > 80 && (
        <p style={{ fontSize: '0.75rem', color: '#dc2626', marginTop: '4px', marginBottom: 0 }}>
          ⚠️ Tallennustila on lähes täynnä — poista vanhoja tiedostoja
        </p>
      )}
    </div>
  );
}