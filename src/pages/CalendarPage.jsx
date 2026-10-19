import { useMemo, useState } from 'react';
import { calendarEvents } from '../data/sampleData';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
const iso = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;

export default function CalendarPage() {
  const today = new Date();
  const [cursor, setCursor] = useState({ y: today.getFullYear(), m: today.getMonth() });
  const [selected, setSelected] = useState(iso(today.getFullYear(), today.getMonth(), today.getDate()));

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1).getDay();
    const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
    return [...Array(first).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, [cursor]);

  const eventsByDate = useMemo(() => {
    const map = {};
    calendarEvents.forEach((e) => { (map[e.date] ||= []).push(e); });
    return map;
  }, []);

  const shift = (delta) => {
    const d = new Date(cursor.y, cursor.m + delta, 1);
    setCursor({ y: d.getFullYear(), m: d.getMonth() });
  };
  const goToday = () => {
    setCursor({ y: today.getFullYear(), m: today.getMonth() });
    setSelected(iso(today.getFullYear(), today.getMonth(), today.getDate()));
  };

  const todayIso = iso(today.getFullYear(), today.getMonth(), today.getDate());
  const monthLabel = new Date(cursor.y, cursor.m, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' });
  const selectedEvents = eventsByDate[selected] || [];

  return (
    <div className="page">
      <h2 className="page-title">▣ Calendar</h2>
      <p className="muted small">Callbacks, coaching sessions and meetings live here.</p>
      <div className="cal-card">
        <div className="cal-head">
          <button className="pager-btn" onClick={() => shift(-1)} aria-label="Previous month">‹</button>
          <b>{monthLabel}</b>
          <div className="row gap">
            <button className="btn btn-outline btn-sm" onClick={goToday}>Today</button>
            <button className="pager-btn" onClick={() => shift(1)} aria-label="Next month">›</button>
          </div>
        </div>
        <div className="cal-grid cal-weekdays">{WEEKDAYS.map((d, i) => <span key={i}>{d}</span>)}</div>
        <div className="cal-grid">
          {cells.map((d, i) => {
            if (d === null) return <span key={`e${i}`} />;
            const key = iso(cursor.y, cursor.m, d);
            const has = eventsByDate[key];
            return (
              <button
                key={key}
                className={`cal-day ${key === todayIso ? 'today' : ''} ${key === selected ? 'selected' : ''}`}
                onClick={() => setSelected(key)}
                aria-label={`${d} ${monthLabel}${has ? `, ${has.length} events` : ''}`}
              >
                {d}
                {has && <i className="event-dot" />}
              </button>
            );
          })}
        </div>
      </div>
      <h3 className="eyebrow upcoming">{selected === todayIso ? 'TODAY' : selected}</h3>
      {selectedEvents.length === 0 ? (
        <p className="muted small">Nothing scheduled.</p>
      ) : (
        <ul className="rows">
          {selectedEvents.map((e) => (
            <li key={e.title} className="row-card"><div className="row-main static"><span className="grow"><b>{e.title}</b><small>{e.time} · {e.kind}</small></span></div></li>
          ))}
        </ul>
      )}
    </div>
  );
}
