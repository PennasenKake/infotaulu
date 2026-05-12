// client/src/components/aiAssistant/templates/minimalistinen.js
export default function minimalistinenTemplate({ otsikko, sisalto, kehotus }) {
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
      --red:      #CC0000;
      --ink:      #111111;
      --ink-soft: #333333;
      --muted:    #888888;
      --bg:       #FAFAFA;
      --white:    #FFFFFF;
      --rule:     #E8E8E8;
    }

    body {
      font-family: 'Barlow', sans-serif;
      background: var(--bg);
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      display: grid;
      grid-template-rows: auto 1fr auto;
    }

    /* ── Header-alue ── */
    .header {
      padding: 80px 100px 0;
    }

    /* Logo-rivi */
    .logo-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 64px;
      border-bottom: 1px solid var(--rule);
    }

    .org-left {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .cross-box {
      width: 52px;
      height: 52px;
      background: var(--red);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .cross-svg {
      width: 26px;
      height: 26px;
    }

    .org-name {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 28px;
      font-weight: 700;
      color: var(--ink);
      letter-spacing: 2px;
      text-transform: uppercase;
    }

    .year-badge {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 24px;
      font-weight: 700;
      color: var(--muted);
      letter-spacing: 2px;
    }

    /* ── Otsikko-blokki ── */
    .title-block {
      padding-top: 80px;
    }

    /* Numero-koristelu */
    .eyebrow {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 22px;
      font-weight: 700;
      color: var(--red);
      letter-spacing: 4px;
      text-transform: uppercase;
      margin-bottom: 28px;
    }

    .headline {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 108px;
      font-weight: 900;
      color: var(--ink);
      line-height: 0.9;
      letter-spacing: -2px;
      text-transform: uppercase;
      word-break: break-word;
    }

    /* Punainen alleviivakoriste otsikon alla */
    .title-rule {
      margin-top: 48px;
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .title-rule-red {
      width: 60px;
      height: 4px;
      background: var(--red);
      border-radius: 2px;
    }

    .title-rule-light {
      flex: 1;
      height: 1px;
      background: var(--rule);
    }

    /* ── Sisältöalue ── */
    .body {
      padding: 64px 100px;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .content-text {
      font-size: 46px;
      line-height: 1.55;
      color: var(--ink-soft);
      font-weight: 400;
      letter-spacing: -0.3px;
    }

    /* ── Kehotus ── */
    .cta-wrap {
      margin-top: 72px;
      padding-top: 56px;
      border-top: 1px solid var(--rule);
    }

    .cta {
      display: inline-flex;
      align-items: center;
      gap: 20px;
      color: var(--red);
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 1px;
      text-transform: uppercase;
    }

    /* Nuoli-ikoni */
    .cta-arrow {
      width: 56px;
      height: 56px;
      border: 2px solid var(--red);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    /* ── Footer ── */
    .footer {
      padding: 48px 100px;
      border-top: 1px solid var(--rule);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .footer-url {
      font-family: 'Barlow Condensed', sans-serif;
      font-size: 26px;
      font-weight: 700;
      color: var(--muted);
      letter-spacing: 1.5px;
      text-transform: uppercase;
    }

    .footer-brand {
      font-size: 24px;
      color: var(--muted);
      font-weight: 500;
    }
  </style>
</head>
<body>

  <div class="header">
    <div class="logo-row">
      <div class="org-left">
        <div class="cross-box">
          <svg class="cross-svg" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="0" width="6" height="26" rx="1" fill="white"/>
            <rect x="0" y="10" width="26" height="6" rx="1" fill="white"/>
          </svg>
        </div>
        <div class="org-name">SPR Nilsiä</div>
      </div>
      <div class="year-badge">2025</div>
    </div>

    <div class="title-block">
      <div class="eyebrow">Tiedote</div>
      <div class="headline">${otsikko}</div>
      <div class="title-rule">
        <div class="title-rule-red"></div>
        <div class="title-rule-light"></div>
      </div>
    </div>
  </div>

  <div class="body">
    <div class="content-text">${sisalto.replace(/\n/g, '<br><br>')}</div>
    ${kehotus ? `
    <div class="cta-wrap">
      <div class="cta">
        <div class="cta-arrow">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path d="M5 11H17M17 11L11 5M17 11L11 17" stroke="#CC0000" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
        ${kehotus}
      </div>
    </div>` : ''}
  </div>

  <div class="footer">
    <div class="footer-url">sprinfotaulu.fi</div>
    <div class="footer-brand">Suomen Punainen Risti</div>
  </div>

</body>
</html>`;
}