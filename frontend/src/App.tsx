import { Route, Routes } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CrimesPage from './pages/CrimesPage';
import CombatPage from './pages/CombatPage';
import BossPage from './pages/BossPage';
import PropertiesPage from './pages/PropertiesPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="crimes" element={<CrimesPage />} />
        <Route path="combat" element={<CombatPage />} />
        <Route path="boss" element={<BossPage />} />
        <Route path="properties" element={<PropertiesPage />} />
      </Route>
    </Routes>
  );
}

export default App;
