// src/hooks/useAuth.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = (API_URL) => {
    
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(null);

  // LocalStorage-tarkistus
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedEmail = localStorage.getItem('authenticatedEmail');

    if (savedToken && savedEmail) {
      setToken(savedToken);
      setIsAuthenticated(true);
      setEmail(savedEmail);
    }
  }, []);

// 10 minuutin automaattinen uloskirjautuminen
useEffect(() => {
  if (!isAuthenticated || !token) return;

  const loginTime = localStorage.getItem('loginTime');
  if (!loginTime) return;

  const remaining =
    10 * 60 * 1000 - (Date.now() - parseInt(loginTime));

  if (remaining <= 0) {
    logout();
    return;
  }

  const timeout = setTimeout(() => {
    logout();
    alert('Sessio on vanhentunut (10 minuuttia)');
  }, remaining);

  return () => clearTimeout(timeout);
}, [isAuthenticated, token]);


  const generateOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setResponse({ type: 'error', text: 'Syötä sähköpostiosoite' });
      return;
    }

    setIsGenerating(true);
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/generate-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse({ type: 'success', text: 'Koodi lähetetty onnistuneesti!' });
      } else if (res.status === 429) {
        setResponse({ 
          type: 'error', 
          text: '⏳ Liian monta OTP-pyyntöä. Odota 10 minuuttia ennen uutta yritystä.' 
        });
      } else {
        setResponse({ type: 'error', text: data.error || 'Virhe OTP:n luonnissa' });
      }
    } catch (err) {
      setResponse({ type: 'error', text: 'Palvelinyhteysvirhe' });
    } finally {
      setIsGenerating(false);
    }
  };


  const verifyOtp = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedOtp = otp.trim();

    if (!trimmedEmail) {
      setResponse({ type: 'error', text: 'Syötä sähköpostiosoite' });
      return;
    }
    if (!trimmedOtp || trimmedOtp.length !== 6) {
      setResponse({ type: 'error', text: 'Koodin täytyy olla tasan 6 merkkiä' });
      return;
    }

    setIsVerifying(true);
    setResponse(null);

    try {
      const res = await fetch(`${API_URL}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, otp: trimmedOtp }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        setResponse({ type: 'success', text: 'Kirjautuminen onnistui!' });

        localStorage.setItem('token', data.token);
        localStorage.setItem('authenticatedEmail', trimmedEmail);
        localStorage.setItem('loginTime', Date.now().toString());

        setToken(data.token);
        setIsAuthenticated(true);

        setTimeout(() => navigate('/dashboard'), 1200);
      } else {
        setResponse({ type: 'error', text: data.error || 'Virheellinen tai vanhentunut koodi' });
      }
    } catch (err) {
      setResponse({ type: 'error', text: 'Palvelinyhteysvirhe' });
    } finally {
      setIsVerifying(false);
    }
  };


  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('authenticatedEmail');
    localStorage.removeItem('loginTime');
    setToken(null);
    setIsAuthenticated(false);
    setEmail('');
    setOtp('');
    setResponse(null);
    setIsRateLimited(false);
    navigate('/');
  };

  // Palauta kaikki arvot
  return {
    email, setEmail,
    otp, setOtp,
    response, setResponse,
    isLoading, setIsLoading,
    isRateLimited, setIsRateLimited,
    isAuthenticated,
    isGenerating,          
    isVerifying, 
    token,
    generateOtp,
    verifyOtp,
    logout
  };
};