// client/src/components/aiAssistant/templates/perus.js
export default function perusTemplate({ otsikko, sisalto, kehotus }) {
  return `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=1080">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

    :root {
      --red:        #CC0000;
      --red-dark:   #990000;
      --red-light:  #FF1A1A;
      --white:      #FFFFFF;
      --off-white:  #F7F3EE;
      --ink:        #1A1008;
      --ink-soft:   #3D2B1F;
      --gold:       #C8922A;
    }

    body {
      font-family: 'Barlow', Georgia, serif;
      background: var(--off-white);
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* ── Tausta-kuvio ── */
    body::before {
      content: '';
      position: absolute;
      inset: 0;
      background:
        radial-gradient(ellipse 900px 600px at 50% -100px, rgba(204,0,0,0.12) 0%, transparent 70%),
        radial-gradient(ellipse 600px 800px at 110% 110%, rgba(200,146,42,0.07) 0%, transparent 60%);
      pointer-events: none;
    }

    /* ── Punainen palkki ylhäällä ── */
    .top-bar {
      background: var(--red);
      height: 14px;
      width: 100%;
      flex-shrink: 0;
    }

    /* ── Header ── */
    .header {
      background: var(--red);
      padding: 70px 80px 80px;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
    }

    /* Geometrinen koristekuvio headeriin */
    .header::before {
      content: '';
      position: absolute;
      right: -60px;
      top: -60px;
      width: 340px;
      height: 340px;
      border: 60px solid rgba(255,255,255,0.06);
      border-radius: 50%;
    }
    .header::after {
      content: '';
      position: absolute;
      right: 40px;
      bottom: -80px;
      width: 200px;
      height: 200px;
      border: 40px solid rgba(255,255,255,0.05);
      border-radius: 50%;
    }

    .logo-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 52px;
    }

    .cross-badge {
      width: 68px;
      height: 68px;
      background: var(--white);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 4px 20px rgba(0,0,0,0.25);
    }

    /* SVG-risti */
    .cross-svg {
      width: 34px;
      height: 34px;
    }

    .org-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 32px;
      font-weight: 700;
      color: var(--white);
      letter-spacing: 2px;
      text-transform: uppercase;
      opacity: 0.95;
    }

    .headline {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 96px;
      font-weight: 900;
      color: var(--white);
      line-height: 0.95;
      letter-spacing: -1px;
      text-transform: uppercase;
      word-break: break-word;
      /* Pehmeä varjo luettavuudeksi */
      text-shadow: 0 4px 24px rgba(0,0,0,0.2);
    }

    /* ── Punainen viiva otsikon alla ── */
    .divider {
      width: 80px;
      height: 6px;
      background: var(--gold);
      margin: 48px 80px 0;
      border-radius: 3px;
      flex-shrink: 0;
    }

    /* ── Sisältöalue ── */
    .body {
      flex: 1;
      padding: 60px 80px 50px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .content-text {
      font-size: 48px;
      line-height: 1.5;
      color: var(--ink-soft);
      font-weight: 400;
      letter-spacing: -0.3px;
    }

    .content-text strong {
      color: var(--ink);
      font-weight: 600;
    }

    /* ── Kehotus-nappi ── */
    .cta-wrap {
      margin-top: 64px;
    }

    .cta {
      display: inline-block;
      background: var(--red);
      color: var(--white);
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 40px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
      padding: 28px 60px;
      border-radius: 6px;
      box-shadow: 0 8px 32px rgba(204,0,0,0.3);
      position: relative;
    }

    /* Kultainen aksentti CTA:n alla */
    .cta::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 12px;
      right: 12px;
      height: 6px;
      background: var(--gold);
      border-radius: 0 0 4px 4px;
    }

    /* ── Footer ── */
    .footer {
      background: var(--ink);
      padding: 36px 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }

    .footer-url {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--gold);
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    .footer-brand {
      font-size: 26px;
      color: rgba(255,255,255,0.5);
      font-weight: 500;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="top-bar"></div>

  <div class="header">
    <div class="logo-row">
      <div class="cross-badge">
        <svg class="cross-svg" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="13" y="0" width="8" height="34" rx="1" fill="#CC0000"/>
          <rect x="0" y="13" width="34" height="8" rx="1" fill="#CC0000"/>
        </svg>
      </div>
      <div class="org-name">SPR Nilsiä</div>
    </div>
    <div class="headline">${otsikko}</div>
  </div>

  <div class="divider"></div>

  <div class="body">
    <div class="content-text">${sisalto.replace(/\n/g, '<br><br>')}</div>
    ${kehotus ? `<div class="cta-wrap"><div class="cta">${kehotus}</div></div>` : ''}
  </div>

  <div class="footer">
    <div class="footer-url">sprinfotaulu.fi</div>
    <div class="footer-brand">Suomen Punainen Risti</div>
  </div>
</body>
</html>`;
}