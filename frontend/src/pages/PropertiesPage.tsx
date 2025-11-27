import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

export default function PropertiesPage() {
  const { client, withAuth } = useApi();
  const { refreshBoss } = useAuth();
  const [available, setAvailable] = useState<any[]>([]);
  const [owned, setOwned] = useState<any[]>([]);

  const load = async () => {
    const [templates, mine] = await Promise.all([
      client.get('/api/properties', withAuth()),
      client.get('/api/properties/mine', withAuth()),
    ]);
    setAvailable(templates.data);
    setOwned(mine.data);
  };

  useEffect(() => {
    load();
  }, []);

  const buy = async (propertyId: number) => {
    await client.post('/api/properties/buy', { propertyId }, withAuth());
    await load();
    refreshBoss();
  };

  const collect = async (ownershipId: number) => {
    await client.post('/api/properties/collect-income', { ownershipId }, withAuth());
    await load();
    refreshBoss();
  };

  const upgrade = async (ownershipId: number) => {
    await client.post('/api/properties/upgrade', { ownershipId }, withAuth());
    await load();
    refreshBoss();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Properties</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="card space-y-2">
          <h2 className="text-xl font-semibold">Available</h2>
          {available.map((p) => (
            <div key={p.id} className="border border-neon-purple/20 rounded p-3">
              <p className="font-semibold">{p.name}</p>
              <p className="text-xs text-gray-400">Cost ${p.basePurchaseCost}</p>
              <button className="button-primary mt-2" onClick={() => buy(p.id)}>Buy</button>
            </div>
          ))}
        </div>
        <div className="card space-y-2">
          <h2 className="text-xl font-semibold">Owned</h2>
          {owned.map((o) => (
            <div key={o.id} className="border border-neon-purple/20 rounded p-3 space-y-1">
              <p className="font-semibold">{o.property.name}</p>
              <p className="text-xs text-gray-400">Upgrade level {o.upgradeLevel}</p>
              <div className="flex gap-2">
                <button className="button-primary" onClick={() => collect(o.id)}>Collect</button>
                <button className="button-primary" onClick={() => upgrade(o.id)}>Upgrade</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
