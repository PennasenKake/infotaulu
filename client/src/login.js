import React from 'react';

export default function Login({email, setEmail, otp, setOtp, generateOtp, verifyOtp, response, isLoading,
}) {
  return (
    <div className="App">
      <div className="two-column sidebar">
        
        {/* OHJEPANEELI */}
        <div className="guide">
          <div className="panel" aria-labelledby="guide-title">
            <h2 className="panel-title" id="guide-title">Ohjeet</h2>
            <ul>
              <li>Kirjaudu sisään saadaksesi muokkausoikeudet</li>
              <li>Vain valtuutetut käyttäjät voivat ladata tiedostoja</li>
              <li>Sallitut tiedostotyypit: JPG, PNG, MP4</li>
              <li>Ladatut tiedostot näkyvät infotaululla automaattisesti</li>
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
            <button onClick={generateOtp} disabled={isLoading}>
              {isLoading ? 'Lähetetään...' : 'Luo OTP'}
            </button>

            <input type="text" placeholder="Kertakäyttökoodi" value={otp} onChange={(e) => setOtp(e.target.value)} disabled={isLoading} />
            <button onClick={verifyOtp} disabled={isLoading}>
              {isLoading ? 'Tarkistetaan...' : 'Vahvista'}
            </button>

            <p className={response.toLowerCase().includes('virhe') ? 'error-text' : ''}>
              {response}
            </p>

            <p className="help-text">
              Ongelmia kirjautumisessa? Ota yhteyttä osaston ylläpitoon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}