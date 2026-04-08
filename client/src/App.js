import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';

import Login from './login';
import Dashboard from './dashboard';

function App() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || 'https://infotaulu-backend.up.railway.app';

  // Tarkista localStorage käynnistyksessä
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('authenticatedEmail');

    if (savedToken && savedEmail) {
      setToken(savedToken);
      setIsAuthenticated(true);
      setEmail(savedEmail);
    }
  }, []);

  // 15 minuutin automaattinen uloskirjautuminen + refreshauksen tarkistus
  useEffect(() => {
    if (!isAuthenticated || !token) return;

    const loginTime = localStorage.getItem('loginTime');
    const now = Date.now();

    // Jos istunto on jo vanhentunut refreshauksen yhteydessä
    if (loginTime && now - parseInt(loginTime) > 10 * 60 * 1000) {
      handleLogout();
      alert('Sessio on vanhentunut. Kirjaudu uudelleen.');
      return;
    }

    // Aseta uusi timeout
    const timeout = setTimeout(() => {
      handleLogout();
      alert('Sessio on vanhentunut (10 minuuttia). Kirjaudu uudelleen sisään.');
    }, 10 * 60 * 1000);   // ← 10 minuuttia

    // Tallenna kirjautumisaika
    localStorage.setItem('loginTime', now.toString());

    return () => clearTimeout(timeout);
  }, [isAuthenticated, token]);

  const generateOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setResponse('Syötä sähköpostiosoite');
      return;
    }

    setIsLoading(true);
    setResponse('');

    try {
      const res = await fetch(`${API_URL}/api/auth/generate-otp`, {
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
      setResponse('Palvelinyhteysvirhe – onko backend käynnissä?');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail) {
      setResponse('Syötä sähköpostiosoite');
      return;
    }
    if (!trimmedOtp || trimmedOtp.length !== 6) {
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

      if (res.ok && data.token) {
        setResponse('Kirjautuminen onnistui!');

        localStorage.setItem('token', data.token);
        localStorage.setItem('authenticatedEmail', trimmedEmail);
        localStorage.setItem('loginTime', Date.now().toString());

        setToken(data.token);
        setIsAuthenticated(true);

        setTimeout(() => navigate('/dashboard'), 1200);
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authenticatedEmail');
    localStorage.removeItem('loginTime');    
    setToken(null);
    setIsAuthenticated(false);
    setEmail('');
    setOtp('');
    setResponse('');
    navigate('/');
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? (
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