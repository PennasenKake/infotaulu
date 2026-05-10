import React from 'react';

export default function DeviceStatus({ deviceStatus }) {
  if (!deviceStatus) return null;

  return (
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
  );
}