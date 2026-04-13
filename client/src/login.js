import React from 'react';

export default function Login({
  email,
  setEmail,
  otp,
  setOtp,
  generateOtp,
  verifyOtp,
  response,
  isLoading,
  isRateLimited,          
  setIsRateLimited        
}) {
  return (
    <div className="App">
      <div className="two-column sidebar">
        
        {/* OHJEPANEELI */}
        <div className="guide">
          <div className="panel" aria-labelledby="guide-title">
            <h2 className="panel-title" id="guide-title">Ohjeet</h2>
            <ul>
                <li><strong>Kirjaudu sisään</strong> saadaksesi muokkausoikeudet.</li>
                <li><strong>Vain valtuutetut käyttäjät</strong> voivat ladata tiedostoja.</li>
                <li>Kirjoita <strong>sähköpostiosoitteesi</strong> alla olevaan kenttään.</li>
                <li>Paina <strong>“Luo OTP”</strong>-nappia – saat 6-numeroisen kertakäyttökoodin sähköpostiisi (tarkista myös roskaposti-kansio).</li>
                <li>Kopioi koodi sähköpostista ja liimaa se <strong>“Kertakäyttökoodi”</strong>-kenttään tällä sivulla.</li>
                <li>Paina <strong>“Vahvista”</strong>-nappia – hallintanäkymä avautuu automaattisesti.</li>
                <li>Jos saat virheilmoituksen, tarkista että:
                  <ul>
                    <li>sähköposti on whitelistalla (kysy ylläpidolta jos epäilet)</li>
                    <li>koodi on syötetty oikein (6 numeroa)</li>
                    <li>koodi ei ole vanhentunut (voimassa 5 minuuttia)</li>
                  </ul>
                </li>
            </ul>
          </div>
        </div>

        {/* KIRJAUTUMISPANEELI */}
        <div className="login">
          <div className="panel" aria-labelledby="login-title">
            <h2 className="panel-title" id="login-title">Kirjaudu</h2>

            <input
              type="email"
              placeholder="Sähköposti"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />

            <button onClick={generateOtp} disabled={isGenerating || isRateLimited} >
              { isRateLimited ? 'Odota 10 minuuttia...' : isGenerating ? 'Lähetetään...' : 'Luo Kertakäyttökoodi'}
            </button>

            {response && (
              <p className={`response-message ${response.type === 'error' ? 'error-text' : 'success-text'}`}>
                {response.text}
              </p>
              
            )}

            <input 
              type="text" 
              placeholder="Kertakäyttökoodi" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              disabled={isLoading} 
            />

            <button onClick={verifyOtp} disabled={isVerifying || isGenerating}>
              {isVerifying ? 'Tarkistetaan...' : 'Vahvista'}
            </button>

            <p className="help-text">
              Ongelmia kirjautumisessa? Ota yhteyttä osaston ylläpitoon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}