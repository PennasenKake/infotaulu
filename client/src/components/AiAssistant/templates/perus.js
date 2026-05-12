// client/src/components/AIAssistant/templates/perus.js
export default function perusTemplate({ otsikko, sisalto, kehotus }) {
  return `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #f8fafc;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
      padding: 60px;
    }
    .card {
      background: white;
      border-radius: 32px;
      overflow: hidden;
      width: 100%; max-width: 920px;
      box-shadow: 0 30px 80px rgba(227,6,19,0.18);
    }
    .header {
      background: linear-gradient(135deg, #e30613, #c00410);
      padding: 80px 60px 55px;
      text-align: center;
    }
    .logo {
      display: flex; align-items: center; justify-content: center; gap: 18px;
      margin-bottom: 35px;
    }
    .logo-circle {
      width: 72px; height: 72px;
      background: white; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 36px; color: #e30613; font-weight: 900;
    }
    .title {
      color: white;
      font-size: 68px; font-weight: 800;
      line-height: 1.05; letter-spacing: -2px;
    }
    .body {
      padding: 75px 65px;
      font-size: 44px; line-height: 1.45;
      color: #1e293b;
    }
    .cta {
      margin-top: 55px;
      background: #e30613; color: white;
      font-size: 36px; font-weight: 700;
      padding: 26px 52px; border-radius: 9999px;
      display: inline-block;
    }
    .footer {
      background: #f1f5f9; padding: 32px 65px;
      display: flex; justify-content: space-between; align-items: center;
      font-size: 26px; color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="logo">
        <div class="logo-circle">✚</div>
        <div style="color:white; font-size:29px; font-weight:700;">SPR Nilsiä</div>
      </div>
      <div class="title">${otsikko}</div>
    </div>
    <div class="body">
      <div>${sisalto.replace(/\n/g, '<br><br>')}</div>
      ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    </div>
    <div class="footer">
      <span>sprinfotaulu.fi</span>
      <span>✚ Suomen Punainen Risti</span>
    </div>
  </div>
</body>
</html>`;
}