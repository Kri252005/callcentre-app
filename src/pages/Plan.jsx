import { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { leads, missedCalls } from '../data/sampleData';
import { useAppState } from '../state/AppState';

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;
const PAGE_SIZE = 4;

export function PlanLayout() {
  return (
    <div className="plan">
      <div className="plan-banner">
        <div><small>Today's calling plan</small><b>Planner</b></div>
        <span className="pill pill-dark">Fri, 9 Oct</span>
      </div>
      <div className="page"><Outlet /></div>
    </div>
  );
}

export function CallsToMake() {
  const { openDialer, openLeads } = useAppState();
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState(null);
  const ranked = useMemo(() => [...leads].sort((a, b) => b.intent - a.intent), []);
  const pages = Math.max(1, Math.ceil(ranked.length / PAGE_SIZE));
  const visible = ranked.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <h2 className="page-title">Planned outgoing calls</h2>
      <p className="muted small">Ranked by lead score, so the likeliest closes come first. Tap a row for details.</p>
      <ul className="rows">
        {visible.map((l) => {
          const isOpen = expanded === l.id;
          return (
            <li key={l.id} className={`row-card ${isOpen ? 'open' : ''}`}>
              <button className="row-main" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : l.id)}>
                <span className={`lead-avatar ${l.intent >= 80 ? 'hot' : ''}`}>{l.initials}</span>
                <span className="grow"><b>{l.name}</b><small>{l.interest}</small></span>
                <span className="score"><b>{l.intent}</b><small>score</small></span>
              </button>
              {isOpen && (
                <div className="row-detail">
                  <p><b>Next step:</b> {l.quote}</p>
                  <p><b>Phone:</b> {l.phone} · <b>Closes in:</b> {l.hoursLeft}h · <b>ICP:</b> {l.icp}%</p>
                  <div className="row gap">
                    <button className="btn btn-green" onClick={() => openDialer('human', l)}>☎ Call</button>
                    <a className="btn btn-outline" href={`tel:${l.phone.replace(/\s/g, '')}`}>Phone</a>
                    <button className="btn btn-outline" onClick={() => openLeads(leads.findIndex((x) => x.id === l.id))}>Lead card</button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
      <div className="paging" role="navigation" aria-label="Pages">
        <button disabled={page === 1} onClick={() => setPage(page - 1)} aria-label="Previous page">‹</button>
        <span>Page {page} of {pages}</span>
        <button disabled={page === pages} onClick={() => setPage(page + 1)} aria-label="Next page">›</button>
      </div>
    </>
  );
}

export function Incoming() {
  const { openDialer } = useAppState();
  const total = missedCalls.reduce((s, m) => s + m.value, 0);
  return (
    <>
      <h2 className="page-title">Missed calls</h2>
      <p className="muted small">Ranked by expected value, so the highest stakes come first.</p>
      <div className="stat-strip">
        <div><b>{missedCalls.length}</b><small>MISSED TODAY</small></div>
        <div><b className="green">{inr(total)}</b><small>EXPECTED VALUE AT STAKE</small></div>
      </div>
      <ul className="rows">
        {[...missedCalls].sort((a, b) => b.value - a.value).map((m) => (
          <li key={m.id} className="row-card">
            <div className="row-main static">
              <span className="lead-avatar miss">☏</span>
              <span className="grow"><b>{m.name}</b><small>{m.when} · {m.context}</small></span>
              <span className="right">
                {m.value > 0 ? <b className="green">{inr(m.value)} {m.expires && <small>expires in {m.expires}</small>}</b> : <small>Value unknown</small>}
                <button className="btn btn-green btn-sm" onClick={() => openDialer('human', m)}>☎ Call back</button>
              </span>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export function Recent() {
  const { callLog, openDialer } = useAppState();
  const [selected, setSelected] = useState(null);
  const icon = { out: '↗', in: '↙', missed: '✕' };
  return (
    <>
      <h2 className="page-title">Recent calls</h2>
      <p className="muted small">Tap a call to review it. Calls you make in the app are added here with their real length.</p>
      <ul className="rows">
        {callLog.map((c) => {
          const open = selected === c.id;
          return (
            <li key={c.id} className={`row-card ${open ? 'open' : ''}`}>
              <button className="row-main" aria-expanded={open} onClick={() => setSelected(open ? null : c.id)}>
                <span className={`lead-avatar type-${c.type}`}>{icon[c.type]}</span>
                <span className="grow"><b>{c.name}</b><small>{c.when}{c.length && c.length !== '—' ? ` · ${c.length}` : ''}</small></span>
                <span className="outcome">{c.outcome}</span>
              </button>
              {open && (
                <div className="row-detail">
                  <p><b>Type:</b> {{ out: 'Outgoing', in: 'Incoming', missed: 'Missed' }[c.type]} · <b>Length:</b> {c.length} · <b>Number:</b> {c.phone}</p>
                  <p><b>Notes:</b> {c.notes || 'No notes yet.'}</p>
                  <button className="btn btn-green btn-sm" onClick={() => openDialer('human', c)}>☎ Call back</button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
}
