import { useEffect, useState } from 'react';
import { leads } from '../data/sampleData';
import { useAppState } from '../state/AppState';

function Section({ title, defaultOpen = false, accent, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`collapse ${accent || ''}`}>
      <button className="collapse-head" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        <span>{title}</span>
        <span className="chev">{open ? '⌄' : '›'}</span>
      </button>
      {open && <div className="collapse-body">{children}</div>}
    </div>
  );
}

export default function LeadsModal() {
  const { leadsModal, closeLeads, setLeadsIndex, openDialer } = useAppState();
  const { open, index } = leadsModal;
  const lead = leads[index];

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLeads();
      if (e.key === 'ArrowRight' && index < leads.length - 1) setLeadsIndex(index + 1);
      if (e.key === 'ArrowLeft' && index > 0) setLeadsIndex(index - 1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, index, closeLeads, setLeadsIndex]);

  if (!open || !lead) return null;

  return (
    <div className="modal-backdrop" onClick={closeLeads}>
      <div className="modal" role="dialog" aria-modal="true" aria-label="Leads" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <strong>Leads</strong>
            <div className="modal-sub">Lead {index + 1} of {leads.length} · {lead.hoursLeft}h to close</div>
          </div>
          <button className="icon-btn light" onClick={closeLeads} aria-label="Close leads">✕</button>
        </div>

        <div className="pager">
          <button className="pager-btn" disabled={index === 0} onClick={() => setLeadsIndex(index - 1)} aria-label="Previous lead">‹</button>
          <div className="dots">
            {leads.map((l, i) => (
              <span key={l.id} className={i === index ? 'on' : ''} />
            ))}
          </div>
          <button className="pager-btn" disabled={index === leads.length - 1} onClick={() => setLeadsIndex(index + 1)} aria-label="Next lead">›</button>
        </div>

        <div className="modal-body">
          <div className="status-open">● {lead.status.toUpperCase()}</div>
          <div className="lead-row">
            <span className="lead-avatar">{lead.initials}</span>
            <div className="lead-main">
              <strong>{lead.name}</strong>
              <div className="muted small">{lead.interest}</div>
            </div>
            <span className="badge badge-green">{lead.hoursLeft}h left</span>
          </div>
          <div className="quote-note">📋 {lead.quote}</div>

          <div className="score-row">
            <span>◎ ICP</span>
            <div className="bar"><i style={{ width: `${lead.icp}%` }} /></div>
            <b>{lead.icp}%</b>
          </div>
          <div className="score-row intent">
            <span>🎯 Lead Intent Score</span>
            <b>{lead.intent}</b>
          </div>

          <Section title="ICP FIT BREAKDOWN">
            <ul className="plain-list">
              {lead.breakdown.map((b) => (<li key={b.k}><b>{b.k}:</b> {b.v}</li>))}
            </ul>
          </Section>
          <Section title="↗ HOW WE GOT HERE" accent="purple">
            <p className="small">{lead.how}</p>
          </Section>
          <Section title="📋 WHERE WE PICKED UP SIGNALS" defaultOpen accent="amber">
            {lead.signals.map((s) => (
              <div key={s.title} className="signal">
                <div className="signal-title">{s.icon} {s.title}</div>
                <p>{s.text}</p>
              </div>
            ))}
          </Section>

          {lead.missed > 0 && (
            <div className="cumulative">● CUMULATIVE MISSED: {lead.missed} <span>— {lead.missedNote}</span></div>
          )}

          <div className="modal-actions">
            <button className="btn btn-green" onClick={() => { closeLeads(); openDialer('human', lead); }}>☎ Call {lead.name.split(' ')[0]}</button>
            <a className="btn btn-outline" href={`tel:${lead.phone.replace(/\s/g, '')}`}>Phone</a>
          </div>
        </div>
      </div>
    </div>
  );
}
