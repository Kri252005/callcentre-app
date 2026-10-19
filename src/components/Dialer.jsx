import { useEffect, useRef, useState } from 'react';
import { useAppState } from '../state/AppState';
import { useHumanCall, formatDuration } from '../lib/useHumanCall';
import { usePracticeCall, speechSupport } from '../lib/usePracticeCall';

const STATUS_LABEL = {
  starting: 'Connecting to call network…',
  ready: 'Ready',
  calling: 'Calling…',
  ringing: 'Incoming call',
  'in-call': 'In call',
  ended: 'Call ended',
  error: 'Not connected',
};

function HumanCallTab({ call, target }) {
  const { showToast } = useAppState();
  const [input, setInput] = useState('');
  const busy = ['calling', 'ringing', 'in-call'].includes(call.status);

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(call.myCode);
      showToast('Code copied');
    } catch {
      showToast('Copy failed — select the code manually');
    }
  };

  return (
    <div className="dialer-body">
      {target && (
        <div className="dialer-target">
          <strong>{target.name}</strong>
          <span>{target.phone}</span>
          <a className="btn btn-outline" href={`tel:${target.phone.replace(/\s/g, '')}`}>Dial on phone</a>
        </div>
      )}
      <div className={`status-pill status-${call.status}`} role="status" aria-live="polite">
        <span className="dot" /> {STATUS_LABEL[call.status]}
        {call.status === 'in-call' && <b> · {formatDuration(call.seconds)}</b>}
        {call.status === 'calling' && <b> · {call.remoteCode}</b>}
      </div>

      <div className="code-box">
        <span className="muted">Your call code</span>
        <div className="code-row">
          <code className="code" aria-label="Your call code">{call.myCode || '——————'}</code>
          <button className="btn btn-outline" onClick={copyCode} disabled={!call.myCode}>Copy</button>
        </div>
        <p className="hint">Open this app on a second phone or laptop and enter this code there to talk human-to-human over WebRTC.</p>
      </div>

      {call.status === 'ringing' && (
        <div className="ring-card">
          <b>Incoming call from {call.remoteCode}</b>
          <div className="row gap">
            <button className="btn btn-green" onClick={call.answer}>Answer</button>
            <button className="btn btn-red" onClick={call.hangUp}>Decline</button>
          </div>
        </div>
      )}

      {!busy && (
        <form
          className="row gap"
          onSubmit={(e) => { e.preventDefault(); call.dial(input); }}
        >
          <label className="sr-only" htmlFor="remote-code">Other person's code</label>
          <input
            id="remote-code"
            className="input"
            placeholder="Enter other device's code"
            value={input}
            maxLength={11}
            onChange={(e) => setInput(e.target.value)}
            disabled={call.status !== 'ready' && call.status !== 'ended'}
          />
          <button className="btn btn-green" type="submit" disabled={call.status !== 'ready' && call.status !== 'ended'}>Call</button>
        </form>
      )}

      {(call.status === 'calling' || call.status === 'in-call') && (
        <div className="row gap">
          {call.status === 'in-call' && (
            <button className="btn btn-outline" onClick={call.toggleMute}>{call.muted ? 'Unmute' : 'Mute'}</button>
          )}
          <button className="btn btn-red" onClick={call.hangUp}>Hang up</button>
        </div>
      )}

      {call.error && <p className="error" role="alert">{call.error}</p>}
      <audio ref={call.audioRef} autoPlay />
    </div>
  );
}

function PracticeTab({ onFinished }) {
  const p = usePracticeCall();
  const [text, setText] = useState('');
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [p.transcript]);

  const finish = () => {
    const secs = p.end();
    onFinished(secs, p.transcript.filter((t) => t.from === 'you').length);
  };

  return (
    <div className="dialer-body">
      <p className="hint">
        Practise with an AI customer (Meera). She speaks, you reply by voice or text. Replies come from keyword rules — not a language model — so it is predictable and works offline.
      </p>
      {!p.active ? (
        <button className="btn btn-green" onClick={p.start}>Start practice call</button>
      ) : (
        <>
          <div className="status-pill status-in-call" role="status">
            <span className="dot" /> {p.speaking ? 'Meera is speaking…' : p.listening ? 'Listening…' : 'Your turn'} <b> · {formatDuration(p.seconds)}</b>
          </div>
          <div className="transcript" aria-live="polite">
            {p.transcript.map((t) => (
              <div key={t.at + t.text} className={`bubble ${t.from === 'you' ? 'mine' : 'theirs'}`}>{t.text}</div>
            ))}
            <div ref={endRef} />
          </div>
          <form
            className="row gap"
            onSubmit={(e) => { e.preventDefault(); if (text.trim()) { p.respondTo(text.trim()); setText(''); } }}
          >
            <label className="sr-only" htmlFor="practice-text">Type your reply</label>
            <input id="practice-text" className="input" placeholder="Type your reply…" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn btn-outline" type="submit">Send</button>
            <button
              type="button"
              className={`btn ${p.listening ? 'btn-red' : 'btn-outline'}`}
              onClick={p.listening ? p.stopListening : p.listen}
              disabled={!speechSupport.listen}
              title={speechSupport.listen ? 'Speak your reply' : 'Voice input needs Chrome'}
            >
              {p.listening ? 'Stop' : '🎤 Speak'}
            </button>
          </form>
          <button className="btn btn-red" onClick={finish}>End call</button>
        </>
      )}
      {p.error && <p className="error" role="alert">{p.error}</p>}
      {!speechSupport.speak && <p className="error">This browser cannot speak aloud; transcript only.</p>}
    </div>
  );
}

export default function Dialer() {
  const { dialer, closeDialer, openDialer, logCall, showToast } = useAppState();
  const [everOpened, setEverOpened] = useState(false);
  const [tab, setTab] = useState('human');
  const call = useHumanCall(everOpened);
  const lastLogged = useRef(null);

  useEffect(() => {
    if (dialer.open) { setEverOpened(true); setTab(dialer.mode === 'practice' ? 'practice' : 'human'); }
  }, [dialer.open, dialer.mode]);

  // Log every finished real call with its measured length.
  useEffect(() => {
    if (!call.lastCall || lastLogged.current === call.lastCall) return;
    lastLogged.current = call.lastCall;
    const { remoteCode, seconds, direction } = call.lastCall;
    logCall({
      name: dialer.target?.name ?? `Peer ${remoteCode}`,
      phone: dialer.target?.phone ?? 'In-app (WebRTC)',
      type: direction === 'in' ? 'in' : 'out',
      when: 'Just now',
      length: formatDuration(seconds),
      outcome: 'Connected',
      notes: 'Real in-app WebRTC call.',
    });
    showToast(`Call logged · ${formatDuration(seconds)}`);
  }, [call.lastCall, dialer.target, logCall, showToast]);

  // Incoming call should surface the panel even if it was closed.
  useEffect(() => {
    if (call.status === 'ringing' && !dialer.open) openDialer('human', null);
  }, [call.status, dialer.open, openDialer]);

  const onPracticeFinished = (secs, replies) => {
    logCall({
      name: 'Meera (AI practice)', phone: 'AI practice call', type: 'out', when: 'Just now',
      length: formatDuration(secs), outcome: 'Practice', notes: `Practice call, ${replies} replies.`,
    });
    showToast('Practice call saved to Recent');
  };

  return (
    <div className={`dialer ${dialer.open ? 'open' : ''}`} aria-hidden={!dialer.open}>
      <div className="dialer-head">
        <strong>Calling</strong>
        <button className="icon-btn" onClick={closeDialer} aria-label="Close dialer">✕</button>
      </div>
      <div className="tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'human'} className={tab === 'human' ? 'active' : ''} onClick={() => setTab('human')}>In-app call</button>
        <button role="tab" aria-selected={tab === 'practice'} className={tab === 'practice' ? 'active' : ''} onClick={() => setTab('practice')}>Practice (AI)</button>
      </div>
      <div hidden={tab !== 'human'}><HumanCallTab call={call} target={dialer.target} /></div>
      {tab === 'practice' && <PracticeTab onFinished={onPracticeFinished} />}
    </div>
  );
}
