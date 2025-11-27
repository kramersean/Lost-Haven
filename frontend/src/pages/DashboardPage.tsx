import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks/useApi';

export default function DashboardPage() {
  const { bossSummary, refreshBoss } = useAuth();
  const api = useApi();

  useEffect(() => {
    refreshBoss();
  }, [refreshBoss]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Boss Overview</h2>
          <p className="text-neon-purple">{bossSummary?.name}</p>
          <p className="text-sm text-gray-300">Level {bossSummary?.level} • {bossSummary?.experience} XP</p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
            <Stat label="Strength" value={bossSummary?.strength} />
            <Stat label="Cunning" value={bossSummary?.cunning} />
            <Stat label="Charisma" value={bossSummary?.charisma} />
            <Stat label="Tech" value={bossSummary?.tech} />
          </div>
        </div>
        <div className="card">
          <h2 className="text-xl font-semibold mb-2">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="button-primary" onClick={() => api.navigate('/crimes')}>Perform Crime</button>
            <button className="button-primary" onClick={() => api.navigate('/combat')}>Start Fight</button>
            <button className="button-primary" onClick={() => api.navigate('/properties')}>Manage Properties</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="p-2 rounded bg-night border border-neon-purple/20">
      <p className="text-xs uppercase tracking-wide text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value ?? '-'}</p>
    </div>
  );
}
