import { createContext, ReactNode, useContext, useEffect, useState, useCallback } from 'react';
import client from '../api/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextShape {
  token: string | null;
  bossSummary: any;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { username: string; email: string; bossName: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshBoss: () => Promise<void>;
}

const AuthContext = createContext<AuthContextShape | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [bossSummary, setBossSummary] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      refreshBoss();
    }
  }, [token, refreshBoss]);

  const login = async (email: string, password: string) => {
    const { data } = await client.post('/api/auth/login', { email, password });
    setToken(data.token);
  };

  const register = async (payload: { username: string; email: string; bossName: string; password: string }) => {
    const { data } = await client.post('/api/auth/register', payload);
    setToken(data.token);
  };

  const logout = () => {
    setToken(null);
    setBossSummary(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const refreshBoss = useCallback(async () => {
    if (!token) return;
    const { data } = await client.get('/api/auth/me', { headers: { Authorization: `Bearer ${token}` } });
    setBossSummary({ ...data.boss, name: data.boss?.name, level: data.boss?.level });
  }, [token]);

  const value: AuthContextShape = { token, bossSummary, login, register, logout, refreshBoss };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext missing');
  return ctx;
}
