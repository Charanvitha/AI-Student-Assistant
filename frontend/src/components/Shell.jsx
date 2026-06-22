import React from 'react';
import { Bot, Briefcase, CalendarCheck, FileText, GraduationCap, LayoutDashboard, LogOut, Map, Search } from 'lucide-react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

const navItems = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/study', 'Study', GraduationCap],
  ['/opportunities', 'Search', Search],
  ['/roadmap', 'Roadmap', Map],
  ['/resume', 'Resume', FileText],
  ['/tasks', 'Tasks', CalendarCheck],
  ['/copilot', 'Copilot', Bot]
];

export default function Shell() {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#f7f8f5]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-line bg-white px-4 py-5 lg:block">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded bg-mint text-white">
            <Briefcase size={20} />
          </div>
          <div>
            <p className="text-sm text-slate-500">CampusCopilot</p>
            <h1 className="font-semibold">AI Workspace</h1>
          </div>
        </div>
        <nav className="mt-8 space-y-1">
          {navItems.map(([to, label, Icon]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded px-3 py-2 text-sm transition ${
                isActive ? 'bg-ink text-white' : 'text-slate-700 hover:bg-slate-100'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 border-b border-line bg-white/90 px-4 py-3 backdrop-blur md:px-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-500">Student command center</p>
              <h2 className="text-lg font-semibold">{user?.careerGoal || 'Career-ready student'}</h2>
            </div>
            <button onClick={logout} className="focus-ring inline-flex items-center gap-2 rounded border border-line px-3 py-2 text-sm hover:bg-slate-50">
              <LogOut size={16} />
              Logout
            </button>
          </div>
          <nav className="mt-3 flex gap-2 overflow-x-auto lg:hidden">
            {navItems.map(([to, label, Icon]) => (
              <NavLink key={to} to={to} end={to === '/'} className="flex shrink-0 items-center gap-2 rounded border border-line bg-white px-3 py-2 text-sm">
                <Icon size={15} />
                {label}
              </NavLink>
            ))}
          </nav>
        </header>
        <main className="px-4 py-6 md:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
