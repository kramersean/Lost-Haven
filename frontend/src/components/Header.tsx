import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { bossSummary, logout } = useAuth();
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-neon-purple/10 bg-gunmetal/80 backdrop-blur">
      <Link to="/" className="text-2xl font-semibold text-neon-purple">Street Syndicate</Link>
      <div className="flex items-center space-x-4 text-sm">
        <ResourcePill label="Cash" value={`$${bossSummary?.cash ?? 0}`} />
        <ResourcePill label="Cred" value={bossSummary?.streetCred ?? 0} />
        <ResourcePill label="Heat" value={bossSummary?.heat ?? 0} />
        <ResourcePill label="Energy" value={`${bossSummary?.energy ?? 0}/${bossSummary?.maxEnergy ?? 0}`} />
        <button onClick={logout} className="text-xs text-red-300 hover:text-white">Logout</button>
      </div>
    </header>
  );
}

function ResourcePill({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="px-3 py-1 rounded-full bg-neon-purple/20 text-neon-purple shadow-glow border border-neon-purple/30">
      <span className="uppercase tracking-widest text-xs">{label}</span> <span className="font-semibold">{value}</span>
    </div>
  );
}
