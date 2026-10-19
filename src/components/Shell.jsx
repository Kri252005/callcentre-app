import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { agent } from '../data/sampleData';
import { useAppState } from '../state/AppState';
import Dialer from './Dialer';
import LeadsModal from './LeadsModal';

const planLinks = [
  { to: '/plan/calls', label: 'Calls to make' },
  { to: '/plan/incoming', label: 'Incoming' },
  { to: '/plan/recent', label: 'Recent' },
];

export default function Shell() {
  const { toast, openDialer } = useAppState();
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();
  const inPlan = pathname.startsWith('/plan');
  const close = () => setMenuOpen(false);

  return (
    <div className="app">
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">On-Ground.ai</div>
        <nav aria-label="Main navigation">
          <NavLink to="/" end onClick={close} className="nav-main">
            <span className="nav-ico" aria-hidden="true">▦</span> Dashboard
          </NavLink>
          <NavLink to="/plan/calls" onClick={close} className={`nav-main ${inPlan ? 'active' : ''}`}>
            <span className="nav-ico" aria-hidden="true">✎</span> Plan
          </NavLink>
          <div className="subnav">
            {planLinks.map((l) => (
              <NavLink key={l.to} to={l.to} onClick={close}>{l.label}</NavLink>
            ))}
            <button className="subnav-btn" onClick={() => { openDialer('practice'); close(); }}>Practice a call</button>
          </div>
          <NavLink to="/calendar" onClick={close} className="nav-main">
            <span className="nav-ico" aria-hidden="true">▣</span> Calendar
          </NavLink>
          <NavLink to="/pulse" onClick={close} className="nav-main nav-pulse">
            <span className="nav-ico" aria-hidden="true">◉</span> Pulse
          </NavLink>
        </nav>
      </aside>
      {menuOpen && <div className="scrim" onClick={close} />}

      <div className="main">
        <header className="topbar">
          <button className="hamburger" onClick={() => setMenuOpen(true)} aria-label="Open menu">☰</button>
          <span className="logo-chip">OG</span>
          <span className="topbar-title">On-Ground.ai</span>
          <div className="topbar-right">
            <button className="pill pill-red" onClick={() => openDialer('human')} aria-label="Open dialer">☎ 2</button>
            <span className="pill pill-dark">🔥 {agent.streak}</span>
            <span className="pill pill-gold">★ {agent.points}</span>
            <span className="avatar">{agent.initials}</span>
          </div>
        </header>
        <main className="content">
          <Outlet />
        </main>
      </div>

      <div className="demo-strip" aria-label="Calling shortcuts">
        <span className="demo-tag">CALL</span>
        <button onClick={() => openDialer('human')}>In-app call</button>
        <button onClick={() => openDialer('practice')}>Practice call</button>
        <button className="dial-fab" onClick={() => openDialer('human')} aria-label="Open dialer">☎</button>
      </div>

      <Dialer />
      <LeadsModal />
      {toast && <div className="toast" role="status">{toast.text}</div>}
    </div>
  );
}
