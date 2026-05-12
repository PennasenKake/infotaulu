// client/src/components/aiAssistant/templates/tumma.js
export default function tummaTemplate({ otsikko, sisalto, kehotus }) {
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
      --red:       #E30613;
      --red-glow:  rgba(227,6,19,0.35);
      --bg:        #0D0D0D;
      --surface:   #161616;
      --surface2:  #1F1F1F;
      --border:    rgba(255,255,255,0.07);
      --white:     #FFFFFF;
      --muted:     rgba(255,255,255,0.45);
      --text:      rgba(255,255,255,0.90);
    }

    body {
      font-family: 'Barlow', sans-serif;
      background: var(--bg);
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    /* Taustaefekti: punainen hehku yläkulmasta */
    body::before {
      content: '';
      position: absolute;
      top: -200px;
      left: -200px;
      width: 900px;
      height: 900px;
      background: radial-gradient(circle, rgba(227,6,19,0.18) 0%, transparent 65%);
      pointer-events: none;
    }

    /* Hienovarainen noise-tekstuuri */
    body::after {
      content: '';
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      opacity: 0.5;
      pointer-events: none;
    }

    /* ── Punainen yläreuna ── */
    .accent-top {
      height: 6px;
      background: var(--red);
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    /* ── Header ── */
    .header {
      padding: 72px 80px 64px;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      border-bottom: 1px solid var(--border);
    }

    .logo-row {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 56px;
    }

    .cross-ring {
      width: 64px;
      height: 64px;
      border: 2px solid var(--red);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px var(--red-glow), inset 0 0 10px rgba(227,6,19,0.1);
    }

    .cross-svg {
      width: 28px;
      height: 28px;
    }

    .org-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 30px;
      font-weight: 700;
      color: var(--muted);
      letter-spacing: 3px;
      text-transform: uppercase;
    }

    /* Punainen piste otsikon edellä */
    .headline-wrap {
      position: relative;
      padding-left: 28px;
    }

    .headline-wrap::before {
      content: '';
      position: absolute;
      left: 0;
      top: 12px;
      bottom: 12px;
      width: 6px;
      background: var(--red);
      border-radius: 3px;
      box-shadow: 0 0 16px var(--red-glow);
    }

    .headline {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 100px;
      font-weight: 900;
      color: var(--white);
      line-height: 0.92;
      letter-spacing: -1.5px;
      text-transform: uppercase;
      word-break: break-word;
    }

    /* ── Sisältöalue ── */
    .body {
      flex: 1;
      padding: 64px 80px 56px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
      z-index: 1;
    }

    .content-text {
      font-size: 46px;
      line-height: 1.55;
      color: var(--text);
      font-weight: 400;
      letter-spacing: -0.2px;
    }

    /* ── Kehotus ── */
    .cta-wrap {
      margin-top: 72px;
    }

    .cta {
      display: inline-block;
      background: transparent;
      color: var(--white);
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 40px;
      font-weight: 800;
      letter-spacing: 2px;
      text-transform: uppercase;
      padding: 26px 60px;
      border: 2px solid var(--red);
      border-radius: 4px;
      box-shadow: 0 0 40px var(--red-glow), inset 0 0 20px rgba(227,6,19,0.05);
      position: relative;
    }

    /* Punainen nurkkakoriste */
    .cta::before {
      content: '';
      position: absolute;
      top: -2px; left: -2px;
      width: 20px; height: 20px;
      border-top: 4px solid var(--red);
      border-left: 4px solid var(--red);
    }
    .cta::after {
      content: '';
      position: absolute;
      bottom: -2px; right: -2px;
      width: 20px; height: 20px;
      border-bottom: 4px solid var(--red);
      border-right: 4px solid var(--red);
    }

    /* ── Footer ── */
    .footer {
      border-top: 1px solid var(--border);
      padding: 38px 80px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      position: relative;
      z-index: 1;
    }

    .footer-url {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--red);
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .footer-brand {
      font-size: 24px;
      color: var(--muted);
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="accent-top"></div>

  <div class="header">
    <div class="logo-row">
      <div class="cross-ring">
        <svg class="cross-svg" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="11" y="0" width="6" height="28" rx="1" fill="#E30613"/>
          <rect x="0" y="11" width="28" height="6" rx="1" fill="#E30613"/>
        </svg>
      </div>
      <div class="org-name">SPR · Nilsiä</div>
    </div>
    <div class="headline-wrap">
      <div class="headline">${otsikko}</div>
    </div>
  </div>

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