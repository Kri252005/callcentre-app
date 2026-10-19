import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { channels, pulse } from '../data/sampleData';
import { useAppState } from '../state/AppState';

export function PulseHome() {
  const { showToast } = useAppState();
  const [query, setQuery] = useState('');
  const q = query.trim().toLowerCase();
  const match = (s) => !q || s.toLowerCase().includes(q);

  return (
    <div className="pulse">
      <div className="pulse-banner"><b>Pulse</b> <small>{pulse.workspace}</small></div>
      <div className="page">
        <input
          className="input"
          type="search"
          placeholder="Ask AvaniBot or search Pulse…"
          aria-label="Search Pulse"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <section className="avani">
          <div><b>AvaniBot</b> <span className="badge badge-amber">ALWAYS ON</span></div>
          <p>{pulse.avaniBot}</p>
          <div className="row gap">
            <button className="btn btn-ghost" onClick={() => showToast('Daily brief: 2 callbacks due, 2 hot leads unactioned')}>☀ Daily Brief</button>
            <button className="btn btn-ghost" onClick={() => showToast('Ask a question: type in the search box above')}>? Ask a question</button>
          </div>
        </section>

        <div className="eyebrow">ROLE AGENTS</div>
        {pulse.roleAgents.filter((a) => match(a.name + a.sub)).map((a) => (
          <Link key={a.id} to="/pulse/callcentre-team" className="list-row">
            <span className="grow"><b>{a.name}</b><small>{a.sub}</small></span>
            <span className="unread">{a.unread}</span>
          </Link>
        ))}

        <div className="eyebrow">TASK AGENTS</div>
        {pulse.taskAgents.filter((a) => match(a.name + a.sub)).map((a) => (
          <button key={a.id} className="list-row" onClick={() => showToast(`${a.name} — ${a.pct}% this week`)}>
            <span className="grow"><b>{a.name}</b><small>{a.sub}</small></span>
            <span className={`pct pct-${a.tone}`}>{a.pct}%</span>
          </button>
        ))}

        <div className="eyebrow">GENERAL</div>
        {pulse.general.filter((a) => match(a.name + a.sub)).map((a) => (
          <button key={a.id} className="list-row" onClick={() => showToast('Relayed channel — read only in this demo')}>
            <span className="grow"><b>{a.name}</b><small>{a.sub}</small></span>
          </button>
        ))}

        <div className="eyebrow">CHANNELS</div>
        <Link to="/pulse/callcentre-team" className="list-row">
          <span className="grow"><b>#callcentre-team</b><small>Call Centre Team</small></span>
        </Link>

        <button className="kudos" onClick={() => showToast('Kudos feed coming soon in this demo')}>
          <b>{pulse.kudos.title}</b> <span className="badge badge-new">NEW</span>
          <small>{pulse.kudos.sub}</small>
        </button>
      </div>
    </div>
  );
}

export function PulseChannel() {
  const { id } = useParams();
  const navigate = useNavigate();
  const channel = channels[id];
  const { messages, sendMessage, needsInputAnswer, setNeedsInputAnswer, showToast } = useAppState();
  const [draft, setDraft] = useState('');
  const [reply, setReply] = useState('');
  const endRef = useRef(null);
  const list = messages[id] || [];

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [list.length]);

  if (!channel) {
    return (
      <div className="page">
        <p className="error">Channel not found.</p>
        <Link to="/pulse" className="btn btn-outline">Back to Pulse</Link>
      </div>
    );
  }

  const submit = (e) => {
    e.preventDefault();
    if (sendMessage(id, draft)) setDraft('');
  };
  const answer = (text) => {
    const t = text.trim();
    if (!t) return;
    setNeedsInputAnswer(t);
    showToast('Answer sent to the channel');
    setReply('');
  };

  return (
    <div className="channel">
      <div className="channel-head">
        <button className="back" onClick={() => navigate('/pulse')} aria-label="Back to Pulse">←</button>
        <b>{channel.title}</b>
      </div>

      <div className="needs-input">
        <div className="ni-head">⚑ <b>Needs your input</b> <span className="count">1</span> <small>pinned</small></div>
        {needsInputAnswer ? (
          <div className="ni-done">✓ You answered: <b>{needsInputAnswer}</b>
            <button className="link" onClick={() => setNeedsInputAnswer(null)}>Undo</button>
          </div>
        ) : (
          <>
            <b>{channel.needsInput.title}</b>
            <small>{channel.needsInput.sub}</small>
            <div className="row gap">
              {channel.needsInput.options.map((o) => (
                <button key={o} className="btn btn-outline btn-sm" onClick={() => answer(o)}>{o}</button>
              ))}
            </div>
            <form className="row gap" onSubmit={(e) => { e.preventDefault(); answer(reply); }}>
              <label className="sr-only" htmlFor="ni-reply">Or type your answer</label>
              <input id="ni-reply" className="input" placeholder="Or type your answer…" value={reply} onChange={(e) => setReply(e.target.value)} />
              <button className="btn btn-amber btn-sm" type="submit" disabled={!reply.trim()}>Send</button>
            </form>
          </>
        )}
      </div>

      <div className="chat" aria-live="polite">
        <div className="day-sep">Today · Call Centre Team</div>
        {list.map((m) => (
          <div key={m.id} className={`msg ${m.mine ? 'mine' : ''}`}>
            {!m.mine && <span className="mini-avatar">{m.initials}</span>}
            <div>
              <div className="msg-meta"><b>{m.from}</b> {m.time}</div>
              <div className="bubble-msg">{m.tag && <b>{m.tag}: </b>}{m.text}</div>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>

      <form className="composer" onSubmit={submit}>
        <label className="sr-only" htmlFor="composer">Message {channel.title}</label>
        <input id="composer" className="input" placeholder={`Message ${channel.title}…`} value={draft} onChange={(e) => setDraft(e.target.value)} />
        <button className="btn btn-green" type="submit" disabled={!draft.trim()}>Send</button>
      </form>
    </div>
  );
}
