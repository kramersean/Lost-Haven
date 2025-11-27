import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

export default function BossPage() {
  const { client, withAuth } = useApi();
  const { bossSummary, refreshBoss } = useAuth();
  const [inventory, setInventory] = useState<any[]>([]);

  const load = async () => {
    const inv = await client.get('/api/inventory', withAuth());
    setInventory(inv.data);
    refreshBoss();
  };

  useEffect(() => {
    load();
  }, []);

  const layLow = async () => {
    await client.post('/api/boss/lay-low', {}, withAuth());
    refreshBoss();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Boss & Gear</h1>
      <div className="card">
        <h2 className="text-xl font-semibold">Stats</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
          <Stat label="Strength" value={bossSummary?.strength} />
          <Stat label="Cunning" value={bossSummary?.cunning} />
          <Stat label="Charisma" value={bossSummary?.charisma} />
          <Stat label="Tech" value={bossSummary?.tech} />
        </div>
        <button className="button-primary mt-3" onClick={layLow}>Lay Low (-10 energy)</button>
      </div>
      <div className="card">
        <h2 className="text-xl font-semibold mb-2">Inventory</h2>
        <div className="grid md:grid-cols-2 gap-2">
          {inventory.map((item) => (
            <div key={item.id} className="p-3 border border-neon-purple/20 rounded">
              <p className="font-semibold">{item.item.name}</p>
              <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: number }) {
  return (
    <div className="p-2 bg-night rounded border border-neon-purple/20">
      <p className="text-xs uppercase text-gray-400">{label}</p>
      <p className="text-lg font-semibold">{value ?? '-'}</p>
    </div>
  );
}
