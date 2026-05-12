// client/src/components/AIAssistant/templates/minimalistinen.js
export default function minimalistinenTemplate({ otsikko, sisalto, kehotus }) {
  return `<!DOCTYPE html>
<html lang="fi">
<head>
  <meta charset="utf-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
      font-family: 'Inter', Arial, sans-serif;
      background: #ffffff;
      width: 1080px; height: 1920px;
      display: flex; align-items: center; justify-content: center;
      padding: 80px;
    }
    .card {
      width: 100%; max-width: 880px;
      border: 8px solid #e30613;
      border-radius: 20px;
      padding: 90px 70px;
      text-align: center;
    }
    .title {
      font-size: 78px; font-weight: 800;
      color: #0f172a; line-height: 1.05;
      margin-bottom: 50px;
    }
    .content {
      font-size: 46px; line-height: 1.5;
      color: #334155;
      margin-bottom: 60px;
    }
    .cta {
      font-size: 38px; font-weight: 700;
      color: #e30613;
      border-bottom: 5px solid #e30613;
      display: inline-block;
      padding-bottom: 6px;
    }
    .footer {
      margin-top: 80px;
      font-size: 26px;
      color: #64748b;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="title">${otsikko}</div>
    <div class="content">${sisalto.replace(/\n/g, '<br><br>')}</div>
    ${kehotus ? `<div class="cta">${kehotus}</div>` : ''}
    <div class="footer">Suomen Punainen Risti — Nilsiän osasto ✚</div>
  </div>
</body>
</html>`;
}