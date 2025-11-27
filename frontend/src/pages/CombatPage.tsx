import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

interface Enemy {
  id: number;
  name: string;
  level: number;
  maxHealth: number;
  baseDps: number;
  cashReward: number;
}

export default function CombatPage() {
  const { client, withAuth } = useApi();
  const { refreshBoss } = useAuth();
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [log, setLog] = useState<any>(null);

  useEffect(() => {
    client.get('/api/combat', withAuth()).then((res) => setEnemies(res.data));
  }, []);

  const fight = async (enemyId: number) => {
    const { data } = await client.post('/api/combat/start', { enemyId }, withAuth());
    setLog(data);
    refreshBoss();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Combat</h1>
      <div className="grid md:grid-cols-2 gap-4">
        {enemies.map((enemy) => (
          <div key={enemy.id} className="card">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{enemy.name}</h3>
                <p className="text-sm text-gray-400">Level {enemy.level}</p>
              </div>
              <button className="button-primary" onClick={() => fight(enemy.id)}>Fight</button>
            </div>
            <p className="text-sm">HP: {enemy.maxHealth}</p>
            <p className="text-sm">DPS: {enemy.baseDps}</p>
          </div>
        ))}
      </div>
      {log && (
        <div className="card space-y-2">
          <h3 className="text-lg font-semibold">Combat Result</h3>
          <p className="text-sm">Status: {log.session.status}</p>
          <p className="text-sm">Cash change: {log.rewards.cashChange}</p>
          <div className="text-xs text-gray-400 max-h-48 overflow-y-auto space-y-1">
            {log.session.log.map((tick: any, idx: number) => (
              <p key={idx}>
                t+{(tick.timestamp / 1000).toFixed(1)}s — Boss HP {tick.bossHp} / Enemy HP {tick.enemyHp}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
