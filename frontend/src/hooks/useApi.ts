import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';

export function useApi() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const withAuth = () => ({ headers: { Authorization: `Bearer ${token}` } });

  return {
    client,
    navigate,
    withAuth,
  };
}
