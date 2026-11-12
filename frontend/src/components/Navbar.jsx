import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  Zap,
  LayoutDashboard,
  Briefcase,
  Users,
  Brain,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react';

const NAV_LINKS = [
  { to: '/',            label: 'Dashboard',  Icon: LayoutDashboard },
  { to: '/jobs',        label: 'Jobs',        Icon: Briefcase },
  { to: '/candidates',  label: 'Candidates',  Icon: Users },
  { to: '/matching',    label: 'AI Matching', Icon: Brain },
  { to: '/interviews',  label: 'Interviews',  Icon: MessageSquare },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-white/5"
            style={{ background: 'rgba(10,10,26,0.85)', backdropFilter: 'blur(20px)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">

          {/* ── Logo ────────────────────────────────────── */}
          <NavLink to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-purple-600
                            flex items-center justify-center shadow-glow-blue
                            group-hover:shadow-glow-purple transition-all duration-300">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">
              <span className="gradient-text-blue">Agentic</span>
              <span className="text-white">Hire</span>
            </span>
          </NavLink>

          {/* ── Desktop nav ──────────────────────────────── */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ to, label, Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200
                   ${isActive
                     ? 'bg-brand-500/15 text-brand-400 border border-brand-500/25'
                     : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* ── Status pill ─────────────────────────────── */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full
                          bg-emerald-500/10 border border-emerald-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">API Connected</span>
          </div>

          {/* ── Mobile hamburger ────────────────────────── */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-slate-200
                        hover:bg-white/5 transition-colors"
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile drawer ───────────────────────────────── */}
      {open && (
        <div className="md:hidden border-t border-white/5 px-4 py-3 space-y-1
                        animate-fade-in" style={{ background: 'rgba(10,10,26,0.95)' }}>
          {NAV_LINKS.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                 ${isActive
                   ? 'bg-brand-500/15 text-brand-400'
                   : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'}`
              }
            >
              <Icon className="w-4 h-4" />
              {label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
