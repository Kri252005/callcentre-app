import { useEffect, useState } from 'react';

const SIGNALS = [
  { ref: 'Call #1842', sense: 'Customer asked about EMI options', decide: 'High purchase intent', act: 'Callback queued · within 15 min', score: 86 },
  { ref: 'Call #1931', sense: 'Pricing objection on premium plan', decide: 'Needs discount offer', act: 'Offer drafted for agent review', score: 71 },
  { ref: 'Call #1720', sense: 'Asked to be called after 6 pm', decide: 'Follow-up due today', act: 'Reminder added to calendar', score: 64 },
];

const CYCLE = 8; // ticks per signal

export default function LiveSignal() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 800);
    return () => clearInterval(id);
  }, []);

  const s = SIGNALS[Math.floor(tick / CYCLE) % SIGNALS.length];
  const phase = tick % CYCLE;

  return (
    <section className="signal-card" aria-label="Live call signals (sample data)">
      <div className="signal-top">
        <span className="live-dot" />
        <span className="mono-label">LIVE SIGNAL · {s.ref}</span>
        <span className="mono-label sample">SAMPLE</span>
      </div>
      <div className={`sig-line ${phase >= 1 ? 'on' : ''}`}><b>SENSE</b> {s.sense}</div>
      <div className={`sig-line ${phase >= 2 ? 'on' : ''}`}><b>DECIDE</b> {s.decide}</div>
      <div className={`sig-line ${phase >= 3 ? 'on' : ''}`}><b>ACT</b> {s.act}</div>
      <div className="sig-score">
        <span>Intent score <strong>{phase >= 4 ? s.score : '--'}</strong>/100</span>
        <div className="bar thick"><i style={{ width: phase >= 4 ? `${s.score}%` : '0%' }} /></div>
      </div>
    </section>
  );
}