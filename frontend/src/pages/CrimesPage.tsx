import { useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';
import { useAuth } from '../context/AuthContext';

interface Crime {
  id: number;
  name: string;
  description: string;
  difficulty: number;
  energyCost: number;
  baseRewardCash: number;
  baseRewardStreetCred: number;
}

export default function CrimesPage() {
  const { client, withAuth } = useApi();
  const { refreshBoss } = useAuth();
  const [crimes, setCrimes] = useState<Crime[]>([]);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    client.get('/api/crimes', withAuth()).then((res) => setCrimes(res.data));
  }, []);

  const attempt = async (crimeId: number) => {
    const { data } = await client.post('/api/crimes/attempt', { crimeId }, withAuth());
    setResult(data);
    refreshBoss();
  };

  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-semibold">Crimes</h1>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {crimes.map((crime) => (
          <div key={crime.id} className="card space-y-2">
            <h3 className="text-lg font-semibold">{crime.name}</h3>
            <p className="text-sm text-gray-400">{crime.description}</p>
            <p className="text-sm">Difficulty: {crime.difficulty}</p>
            <p className="text-sm">Energy: {crime.energyCost}</p>
            <p className="text-sm">Rewards: ${crime.baseRewardCash} / {crime.baseRewardStreetCred} cred</p>
            <button className="button-primary w-full" onClick={() => attempt(crime.id)}>Attempt</button>
          </div>
        ))}
      </div>
      {result && (
        <div className={`card ${result.success ? 'border-green-400/40' : 'border-red-400/40'}`}>
          <p className="font-semibold">{result.crime.name} result</p>
          <p className="text-sm">Outcome: {result.success ? 'Success' : 'Failure'}</p>
          <p className="text-sm">Cash: {result.rewards.cashChange}</p>
          <p className="text-sm">Street Cred: {result.rewards.streetCredChange}</p>
          <p className="text-sm">Heat change: {result.rewards.heatChange}</p>
        </div>
      )}
    </div>
  );
}
