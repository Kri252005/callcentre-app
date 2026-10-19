import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import {
  agent, callsHandled7d, csatTrend7d, kpis, progress, tasks, waiting,
} from '../data/sampleData';
import { useAppState } from '../state/AppState';

const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

export default function Dashboard() {
  const { openLeads, openDialer, showToast } = useAppState();
  const earnPct = Math.round((progress.earningsMonth / progress.earningsTarget) * 100);
  const today = new Date().getHours();
  const greeting = today < 12 ? 'Good morning' : today < 17 ? 'Good afternoon' : 'Good evening';

  const onTask = (kind) => {
    if (kind === 'leads') openLeads(0);
    else if (kind === 'callbacks') openDialer('human', null);
    else showToast('Log outcomes from Plan → Recent');
  };

  return (
    <div className="page">
      <section className="hero">
        <div>
          <div className="hero-sub">{greeting} 👋</div>
          <h1>{agent.name}</h1>
          <div className="hero-sub">{agent.company} · {agent.team}</div>
        </div>
        <div className="hero-actions">
          <span className="badge badge-green">● On Queue</span>
          <Link to="/pulse" className="btn btn-ghost">This week</Link>
        </div>
      </section>

      <section className="kpi-grid" aria-label="Key numbers">
        {kpis.map((k) => (
          <div key={k.id} className="kpi">
            <div className="kpi-value">{k.value}</div>
            <div className="kpi-label">{k.label}</div>
            <span className={`kpi-delta ${k.tone}`}>{k.delta}</span>
          </div>
        ))}
      </section>

      <div className="dash-grid">
        <div className="col">
          <section className="progress-card" aria-label="My progress today">
            <div className="eyebrow light">⚡ MY PROGRESS · TODAY</div>
            <div className="progress-stats">
              <div><b>{progress.leadsCalled}</b><span>Leads Called</span></div>
              <div><b>{progress.leadsClosed}</b><span>Leads Closed</span></div>
            </div>
          </section>

          <section>
            <div className="section-head"><span className="eyebrow">WHO'S WAITING</span><Link to="/plan/incoming">Open planner</Link></div>
            {waiting.map((w) => (
              <button key={w.id} className="list-row" onClick={() => openDialer('human', { name: w.name, phone: '+91 98450 00300' })}>
                <span className="mini-avatar">☉</span>
                <span className="grow"><b>{w.name}</b><small>{w.note}</small></span>
                <span className={`wait wait-${w.tone}`}>{w.wait}</span>
              </button>
            ))}
          </section>
        </div>

        <div className="col">
          <section className="earn-card">
            <div className="earn-head">💰 <b>My earnings this month</b><span className="muted small">{earnPct}% of target</span></div>
            <div className="earn-amount">{inr(progress.earningsMonth)} <small>{inr(progress.earningsPending)} from unpaid invoices</small></div>
            <div className="bar thick"><i style={{ width: `${earnPct}%` }} /></div>
          </section>

          <section className="tasks-card" aria-label="My tasks">
            <div className="tasks-head">☑ My Tasks <span className="count">{tasks.length}</span></div>
            {tasks.map((t) => (
              <button key={t.id} className="task-row" onClick={() => onTask(t.kind)}>
                <span className="task-ico">{t.icon}</span>
                <b>{t.title}</b> <small>{t.sub}</small>
              </button>
            ))}
          </section>
        </div>
      </div>

      <section className="chart-card">
        <div className="eyebrow">CALLS HANDLED · LAST 7 DAYS</div>
        <div className="chart" style={{ height: 160 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={callsHandled7d} margin={{ top: 18, right: 4, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e6e6ea" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis hide />
              <Tooltip cursor={{ fill: 'rgba(0,0,0,0.04)' }} />
              <Bar dataKey="value" radius={[3, 3, 0, 0]} label={{ position: 'top', fontSize: 11, fill: '#555' }}>
                {callsHandled7d.map((d, i) => (<Cell key={d.day} fill={i === callsHandled7d.length - 1 ? '#1a7a5a' : '#5fcaa0'} />))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="chart-card">
        <div className="eyebrow">CSAT TREND · LAST 7 DAYS</div>
        <div className="chart" style={{ height: 150 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={csatTrend7d} margin={{ top: 14, right: 12, left: 4, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e6e6ea" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={11} />
              <YAxis hide domain={[80, 100]} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Line type="monotone" dataKey="value" stroke="#3b6fd4" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
