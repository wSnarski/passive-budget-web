import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Dashboard' },
  { to: '/transactions', label: 'Transactions' },
  { to: '/settings', label: 'Settings' },
];

export default function NavBar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-8">
        <NavLink to="/" className="text-lg font-bold">
          PassiveBudget
        </NavLink>
        <div className="hidden sm:flex gap-6">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `text-sm transition-colors ${
                  isActive ? 'text-blue-400 font-medium' : 'text-gray-300 hover:text-blue-400'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-400 hidden sm:inline">{user?.email}</span>
        <button
          onClick={logout}
          className="text-sm text-gray-400 hover:text-white cursor-pointer"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
