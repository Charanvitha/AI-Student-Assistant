import React, { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../lib/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('campuscopilot_token'));
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('campuscopilot_user') || 'null'));

  async function login(email, password) {
    const { data } = await api.post('/auth/login', { email, password });
    persist(data);
  }

  async function register(payload) {
    const { data } = await api.post('/auth/register', payload);
    persist(data);
  }

  function persist(data) {
    localStorage.setItem('campuscopilot_token', data.token);
    localStorage.setItem('campuscopilot_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem('campuscopilot_token');
    localStorage.removeItem('campuscopilot_user');
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ token, user, login, register, logout }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
