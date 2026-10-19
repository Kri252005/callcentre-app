import { HashRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppStateProvider } from './state/AppState';
import Shell from './components/Shell';
import Dashboard from './pages/Dashboard';
import { CallsToMake, Incoming, PlanLayout, Recent } from './pages/Plan';
import CalendarPage from './pages/CalendarPage';
import { PulseChannel, PulseHome } from './pages/Pulse';

// HashRouter so the app works from any static host (or a plain file server) without rewrite rules.
export default function App() {
  return (
    <AppStateProvider>
      <HashRouter>
        <Routes>
          <Route element={<Shell />}>
            <Route index element={<Dashboard />} />
            <Route path="plan" element={<PlanLayout />}>
              <Route index element={<Navigate to="calls" replace />} />
              <Route path="calls" element={<CallsToMake />} />
              <Route path="incoming" element={<Incoming />} />
              <Route path="recent" element={<Recent />} />
            </Route>
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="pulse" element={<PulseHome />} />
            <Route path="pulse/:id" element={<PulseChannel />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </AppStateProvider>
  );
}
