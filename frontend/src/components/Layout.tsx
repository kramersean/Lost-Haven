import { Link, Outlet, useLocation } from 'react-router-dom';
import Header from './Header';

const navItems = [
  { to: '/', label: 'Dashboard' },
  { to: '/crimes', label: 'Crimes' },
  { to: '/combat', label: 'Combat' },
  { to: '/boss', label: 'Boss & Gear' },
  { to: '/properties', label: 'Properties' },
  { to: '/multiplayer', label: 'Multiplayer (soon)', disabled: true },
];

export default function Layout() {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-night text-white">
      <Header />
      <div className="flex">
        <aside className="w-64 border-r border-neon-purple/10 bg-gunmetal min-h-screen hidden md:block">
          <div className="p-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.disabled ? '#' : item.to}
                className={`block px-3 py-2 rounded-lg transition ${
                  location.pathname === item.to ? 'bg-neon-purple/20 text-neon-purple' : 'hover:bg-neon-purple/10'
                } ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
        <main className="flex-1 p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
