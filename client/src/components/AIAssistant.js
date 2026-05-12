// ─────────────────────────────────────────────────────────────────
// Parannetut Brändätyt HTML-pohjat SPR Nilsiälle
// ─────────────────────────────────────────────────────────────────
function generateBrandedHTML({ otsikko, sisalto, kehotus, template = 'modern' }) {
  const templates = {

    modern: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&family=Playfair+Display:wght@700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      background: #f8fafc;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
      padding: 40px;
    }
    .card {
      background: white;
      width: 940px;
      border-radius: 36px;
      overflow: hidden;
      box-shadow: 0 40px 100px rgba(227,6,19,0.22);
      border: 10px solid #e30613;
    }
    .header {
      background: linear-gradient(135deg, #e30613, #9f0b12);
      color: white;
      padding: 85px 65px 55px;
      text-align: center;
    }
    .logo { font-size: 58px; margin-bottom: 10px; }
    .org { font-size: 27px; font-weight: 600; opacity: 0.95; }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 68px;
      font-weight: 700;
      line-height: 1.05;
      margin-top: 35px;
      letter-spacing: -1.5px;
    }
    .content {
      padding: 75px 70px;
      font-size: 39px;
      line-height: 1.52;
      color: #1e293b;
    }
    .cta {
      margin: 45px 70px 0;
      background: #e30613;
      color: white;
      padding: 28px 55px;
      border-radius: 9999px;
      font-size: 34px;
      font-weight: 700;
      display: inline-block;
    }
    .footer {
      padding: 48px 70px;
      background: #f1f5f9;
      text-align: center;
      color: #64748b;
      font-size: 25px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">✚</div>
      <div class="org">SUOMEN PUNAINEN RISTI</div>
      <div class="org" style="margin-top:8px; font-size:23px;">Nilsiän osasto</div>
      <div class="title">${otsikko}</div>
    </div>
    <div class="content">
      ${sisalto.replace(/\n/g, '<br><br>')}
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">sprinfotaulu.fi • Autamme yhdessä</div>
  </div>
</body>
</html>`,

    dark: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body { font-family: 'Inter', sans-serif; background: #0f172a; width: 1080px; height: 1920px; display: flex; align-items: center; justify-content: center; }
    .card {
      background: #1e2937;
      width: 920px;
      border-radius: 28px;
      overflow: hidden;
      border: 6px solid #e30613;
    }
    .header {
      background: #e30613;
      padding: 80px 60px 50px;
      text-align: center;
      color: white;
    }
    .title { font-size: 72px; font-weight: 800; line-height: 1.05; margin-top: 20px; }
    .content {
      padding: 70px 65px;
      font-size: 41px;
      line-height: 1.5;
      color: #e2e8f0;
    }
    .cta {
      margin: 40px 65px 0;
      background: white;
      color: #e30613;
      padding: 26px 52px;
      border-radius: 9999px;
      font-size: 34px;
      font-weight: 700;
      display: inline-block;
    }
    .footer {
      padding: 40px 65px;
      text-align: center;
      color: #94a3b8;
      font-size: 24px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size:48px;">✚</div>
      <div style="font-size:26px; margin-top:12px;">SPR NILSIÄ</div>
      <div class="title">${otsikko}</div>
    </div>
    <div class="content">
      ${sisalto.replace(/\n/g, '<br><br>')}
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">sprinfotaulu.fi</div>
  </div>
</body>
</html>`,

    minimalistinen: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
    }
    .card {
      width: 880px;
      padding: 100px 70px;
      border: 12px solid #e30613;
      border-radius: 20px;
    }
    .title {
      font-size: 78px;
      font-weight: 800;
      line-height: 1.05;
      color: #0f172a;
      margin-bottom: 60px;
    }
    .content {
      font-size: 42px;
      line-height: 1.55;
      color: #334155;
    }
    .cta {
      margin-top: 70px;
      color: #e30613;
      font-size: 36px;
      font-weight: 700;
      border-bottom: 5px solid #e30613;
      display: inline-block;
      padding-bottom: 6px;
    }
    .footer {
      margin-top: 100px;
      text-align: center;
      color: #64748b;
      font-size: 26px;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">${otsikko}</div>
    <div class="content">${sisalto.replace(/\n/g, '<br><br>')}</div>
    ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    <div class="footer">Suomen Punainen Risti • Nilsiän osasto</div>
  </div>
</body>
</html>`,

    juliste: `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&family=Playfair+Display:wght@700&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', sans-serif;
      background: #fff;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
      padding: 60px;
    }
    .poster {
      width: 960px;
      height: 1700px;
      border: 18px solid #e30613;
      border-radius: 12px;
      position: relative;
      overflow: hidden;
    }
    .red-bar {
      background: #e30613;
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 42px;
      font-weight: 900;
    }
    .content-area {
      padding: 90px 70px;
      text-align: center;
    }
    .title {
      font-family: 'Playfair Display', serif;
      font-size: 82px;
      line-height: 1.05;
      font-weight: 700;
      margin-bottom: 50px;
    }
    .text {
      font-size: 44px;
      line-height: 1.45;
      color: #1e293b;
    }
    .cta {
      margin-top: 80px;
      font-size: 38px;
      font-weight: 700;
      color: #e30613;
    }
    .footer {
      position: absolute;
      bottom: 0; left: 0; right: 0;
      background: #e30613;
      color: white;
      text-align: center;
      padding: 35px;
      font-size: 26px;
    }
  </style>
</head>
<body>
  <div class="poster">
    <div class="red-bar">✚ SPR NILSIÄ ✚</div>
    <div class="content-area">
      <div class="title">${otsikko}</div>
      <div class="text">${sisalto.replace(/\n/g, '<br><br>')}</div>
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">sprinfotaulu.fi</div>
  </div>
</body>
</html>`
  };

  return templates[template] || templates.modern;
}