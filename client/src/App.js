import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './login';
import Dashboard from './dashboard';

function App() {
  const navigate = useNavigate();

  // Tilamuuttujat
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [response, setResponse] = useState(''); // Käyttäjälle näytetään ilmoitus
  const [isLoading, setIsLoading] = useState(false);  // Estää tuplaklickkauksia  

  // Autentikointi
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null); 

  const API_URL = process.env.REACT_APP_API_URL || 'https://infotaulu-backend.up.railway.app';
  
  // Tarkista localStorage käynnistyksessä
  useEffect(() => {

    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('authenticatedEmail');

    if (savedToken && savedEmail) {
      setEmail(savedToken);
      setIsAuthenticated(true);
      setEmail(savedEmail);
    }
  }, []);

  // 15 minuutin automaattinen uloskirjautuminen
  useEffect(() => {
    if (!isAuthenticated || !token) return;

      const timeout = setTimeout(() => {
        handleLogout();
        alert('Sessio on vanhentunut');
      }, 3 * 60 * 1000); // 15 minuuttia

      return () => clearTimeout(timeout);
       
    }, [isAuthenticated, token]);

  // Lähetään OTP-pyyntö backendille
  const generateOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setResponse('Syötä sähköpostiosoite');
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch(`${API_URL}/api/auth/generate-otp`
, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.message || 'Koodi lähetetty onnistuneesti!');
      } else {
        setResponse(data.error || 'Virhe OTP:n luonnissa');
      }
    } catch (err) {
      setResponse('Palvelinyhteysvirhe – onko server käynnissä?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Varmistaa OTP:n oikeellisuuden
  const verifyOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    // Validointi
    if (!trimmedEmail) {
      setResponse('Syötä sähköpostiosoite');
      return;
    }
    if (!trimmedOtp) {
      setResponse('Syötä kertakäyttökoodi');
      return;
    }
    if (trimmedOtp.length !== 6) {
      setResponse('Koodin täytyy olla tasan 6 merkkiä');
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, otp: trimmedOtp }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse('Kirjautuminen onnistui!');

        // Tallennetaan localStorageen
        localStorage.setItem('token', data.token);
        localStorage.setItem('authenticatedEmail', trimmedEmail);

        setToken(data.token);
        setIsAuthenticated(true);

        // Viive, käyttäjä ehtii nähdä viestin
        setTimeout(() => { navigate('/dashboard');
        }, 1200);
      } else {
        setResponse(data.error || 'Virheellinen tai vanhentunut koodi');
      }
    } catch (err) {
      setResponse('Palvelinyhteysvirhe');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };



  // Kirjautuu ulos ja siivoaa tilamuuttujat
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authenticatedEmail');
    setIsAuthenticated(false);
    setEmail('');
    setOtp('');
    setResponse('');
    navigate('/');
  };



  // Reititys - suojaa dashboard vain kirjautuneilta
  return (
    <Routes>
      <Route path="/" element={ isAuthenticated ? (
            <Navigate to="/dashboard" replace/>
          ) : (
            <Login email={email} setEmail={setEmail} otp={otp}
              setOtp={setOtp} generateOtp={generateOtp} verifyOtp={verifyOtp}
              response={response} isLoading={isLoading}
            />
          )
        }
      />

      <Route path="/dashboard" element={
        isAuthenticated ? (
          <Dashboard onLogout={handleLogout} token={token} />
        ) : (
        <Navigate to="/" replace />
      )
    }
  />
  
    <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
          


export default App;