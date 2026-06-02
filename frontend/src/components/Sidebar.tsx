import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/usuarios', label: 'Usuarios', icon: Users },
  { to: '/produtos', label: 'Produtos', icon: Package },
  { to: '/relatorios', label: 'Relatorios', icon: FileText },
];

export default function Sidebar() {
  const { user, logout } = useAuth();

  return (
    <aside className="w-[260px] bg-surface-950 min-h-screen flex flex-col border-r border-surface-800/50">
      <div className="px-7 pt-8 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-surface-950 text-sm font-bold">D</span>
          </div>
          <span className="text-white text-[15px] font-semibold tracking-tight">DentsuCC</span>
        </div>
      </div>

      <nav className="flex-1 px-4 mt-2">
        <p className="px-4 mb-3 text-[11px] font-medium text-surface-600 tracking-widest uppercase">Menu</p>
        <ul className="space-y-0.5">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-200 ${
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-surface-500 hover:text-surface-200 hover:bg-white/[0.04]'
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.7} />
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="px-4 pb-6 mt-auto">
        <div className="px-4 py-3 mb-2 border-t border-surface-800/60 pt-5">
          <p className="text-[13px] font-medium text-surface-300">{user?.name}</p>
          <p className="text-[11px] text-surface-600 mt-0.5">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-[13px] font-medium text-surface-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 w-full"
        >
          <LogOut size={18} strokeWidth={1.7} />
          Sair
        </button>
      </div>
    </aside>
  );
}
