import './App.css';
import React, { useState } from 'react';
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

  // Tarkistetaan localStorage:ssa onko kirjautunut
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isAuthenticated') === 'true'
  );

  const API_URL = process.env.REACT_APP_API_URL || 'https://infotaulu-backend.up.railway.app';
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
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('authenticatedEmail', trimmedEmail);
        setIsAuthenticated(true);
        // Viive, käyttäjä ehtii nähdä viestin
        setTimeout(() => {
          navigate('/dashboard');
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
      <Route
        path="/"
        element={
          isAuthenticated ? (
            // jos jo kirjautunut, ohjataan dashboardiin
            <Navigate to="/dashboard" replace />
          ) : (
            <Login
              email={email}
              setEmail={setEmail}
              otp={otp}
              setOtp={setOtp}
              generateOtp={generateOtp}
              verifyOtp={verifyOtp}
              response={response}
              isLoading={isLoading}
            />
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            // jos ei ole kirjautunut, ohjataan loginiin
            <Navigate to="/" replace />
          )
        }
      />

      {/* Mahdollinen 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;