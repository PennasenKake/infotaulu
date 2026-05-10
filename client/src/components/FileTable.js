// import React from 'react';

// export default function FileTable({
//   files,
//   onDelete,
//   onDownload,
//   onToggle,
//   onDisplayTimeChange,
// }) {
//   return (
//     <div className="file-table-wrapper">
//       <table className="file-table">
//         <thead>
//           <tr>
//             <th>Nimi</th>
//             <th>Lataaja | Päivä</th>
//             <th>Aika | Tila</th>
//             <th>Vanhenee</th>
//             <th>Poista</th>
//           </tr>
//         </thead>
//         <tbody>
//           {files.map((f) => (
//             <tr key={f._id} style={{
//               opacity: f.isActive === false ? 0.45 : 1,
//               transition: 'opacity 0.2s ease'
//             }}>
//               <td>
//                 <button
//                   className="file-download-link"
//                   onClick={() => onDownload(f._id, f.originalName)}
//                   title={
//                     f.isActive === false
//                       ? `${f.originalName} — piilotettu esityksestä. Klikkaa ladataksesi.`
//                       : `Lataa ${f.originalName} omalle koneelle`
//                   }
//                   style={{
//                     textDecoration: f.isActive === false ? 'line-through' : 'none',
//                     color: f.isActive === false ? '#94a3b8' : '#2563eb'
//                   }}
//                 >
//                   {f.originalName}
//                 </button>
//               </td>

//               <td>
//                 <div style={{ fontSize: '0.88rem', color: '#1e293b', fontWeight: '500' }}>
//                   {f.uploadedBy.split('@')[0]}
//                 </div>
//                 <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
//                   {new Date(f.uploadedAt).toLocaleDateString('fi-FI', {
//                     day: 'numeric', month: 'numeric'
//                   })}{' '}
//                   {new Date(f.uploadedAt).toLocaleTimeString('fi-FI', {
//                     hour: '2-digit', minute: '2-digit'
//                   })}
//                 </div>
//               </td>

//               <td>
//                 <div style={{
//                   display: 'flex', alignItems: 'center',
//                   gap: '5px', whiteSpace: 'nowrap'
//                 }}>
//                   <input
//                     type="number"
//                     min="5"
//                     max="600"
//                     defaultValue={f.displaySeconds || 8}
//                     title={`Esitysaika sekunteina (5–600). Nykyinen: ${f.displaySeconds || 8} s.`}
//                     onBlur={(e) => onDisplayTimeChange(f._id, e.target.value)}
//                     onKeyDown={(e) => {
//                       if (e.key === 'Enter') {
//                         onDisplayTimeChange(f._id, e.target.value);
//                         e.target.blur();
//                       }
//                     }}
//                     style={{
//                       width: '48px', padding: '3px 4px',
//                       border: '1px solid #e2e8f0', borderRadius: '4px',
//                       fontSize: '0.88rem', textAlign: 'center'
//                     }}
//                   />
//                   <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>s</span>
//                   <span style={{ color: '#cbd5e1', fontSize: '0.85rem' }}>| </span>
//                   <button
//                     className="toggle-btn"
//                     onClick={() => onToggle(f._id)}
//                     title={f.isActive === false ? 'Aktivoi esitykseen' : 'Piilota esityksestä'}
//                   >
//                     {f.isActive === false ? '▶' : '⏸'}
//                   </button>
//                 </div>
//               </td>

//               <td style={{ fontSize: '0.8rem', whiteSpace: 'nowrap' }}>
//                 {f.expiresAt ? (
//                   <span style={{
//                     color: new Date(f.expiresAt) < new Date(Date.now() + 86400000)
//                       ? '#dc2626' : '#64748b'
//                   }}>
//                     {new Date(f.expiresAt).toLocaleDateString('fi-FI')}
//                   </span>
//                 ) : (
//                   <span style={{ color: '#cbd5e1' }}>—</span>
//                 )}
//               </td>

//               <td>
//                 <button
//                   className="delete-btn"
//                   onClick={() => onDelete(f._id)}
//                 >
//                   Poista
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }