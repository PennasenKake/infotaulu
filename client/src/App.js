import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './login';
import Dashboard from './dashboard';
import { useAuth } from '../src/hooks/useAuth';

function App() {
  const API_URL = process.env.REACT_APP_API_URL || 'https://infotaulu-backend.up.railway.app';
  const auth = useAuth(API_URL);     

  return (
    <Routes>
      <Route
        path="/"
        element={
          auth.isAuthenticated ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Login {...auth} />       
          )
        }
      />

      <Route
        path="/dashboard"
        element={
          auth.isAuthenticated ? (
            <Dashboard onLogout={auth.logout} token={auth.token} />
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