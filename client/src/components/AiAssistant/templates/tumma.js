// client/src/components/AIAssistant/templates/tumma.js
export default function tummaTemplate({ otsikko, sisalto, kehotus }) {
  return `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #0f172a;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
      padding: 60px;
    }
    .card {
      background: #1e293b;
      border-radius: 28px;
      overflow: hidden;
      width: 100%; max-width: 900px;
      box-shadow: 0 30px 80px rgba(0,0,0,0.6);
    }
    .header {
      background: #e30613;
      padding: 65px 60px 45px;
      text-align: center;
    }
    .title {
      color: white;
      font-size: 72px; font-weight: 800;
      line-height: 1.05;
    }
    .body {
      padding: 70px 65px;
      font-size: 42px; line-height: 1.5;
      color: #e2e8f0;
    }
    .cta {
      margin-top: 50px;
      background: white; color: #e30613;
      font-size: 36px; font-weight: 700;
      padding: 24px 50px; border-radius: 9999px;
      display: inline-block;
    }
    .footer {
      padding: 35px 65px;
      color: #94a3b8;
      font-size: 26px;
      display: flex; justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div style="font-size:32px; margin-bottom:25px;">✚ SPR Nilsiä</div>
      <div class="title">${otsikko}</div>
    </div>
    <div class="body">
      <div>${sisalto.replace(/\n/g, '<br><br>')}</div>
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">
      <span>sprinfotaulu.fi</span>
      <span>✚ Punainen Risti</span>
    </div>
  </div>
</body>
</html>`;
}