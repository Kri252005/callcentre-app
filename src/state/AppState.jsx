import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { channels as seedChannels, recentCalls as seedRecent } from '../data/sampleData';

const AppStateContext = createContext(null);
const STORAGE_KEY = 'callcentre-demo-state-v1';

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }) {
  const saved = useMemo(load, []);
  const [messages, setMessages] = useState(
    saved?.messages ?? { 'callcentre-team': seedChannels['callcentre-team'].messages },
  );
  const [needsInputAnswer, setNeedsInputAnswer] = useState(saved?.needsInputAnswer ?? null);
  const [callLog, setCallLog] = useState(saved?.callLog ?? seedRecent);
  const [leadsModal, setLeadsModal] = useState({ open: false, index: 0 });
  const [dialer, setDialer] = useState({ open: false, mode: 'human', target: null });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ messages, needsInputAnswer, callLog }));
    } catch {
      /* storage can be unavailable (private mode); the demo still works */
    }
  }, [messages, needsInputAnswer, callLog]);

  const showToast = useCallback((text) => {
    setToast({ text, id: Date.now() });
    setTimeout(() => setToast((t) => (t && Date.now() - t.id >= 2900 ? null : t)), 3000);
  }, []);

  const sendMessage = useCallback((channelId, text) => {
    const trimmed = text.trim();
    if (!trimmed) return false;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '');
    setMessages((m) => ({
      ...m,
      [channelId]: [
        ...(m[channelId] || []),
        { id: `u${now.getTime()}`, from: 'You', initials: 'AR', time, mine: true, text: trimmed },
      ],
    }));
    return true;
  }, []);

  // Put chat, the needs-input answer and the call log back to the starting sample data.
  const resetDemo = useCallback(() => {
    setMessages({ 'callcentre-team': seedChannels['callcentre-team'].messages });
    setNeedsInputAnswer(null);
    setCallLog(seedRecent);
    showToast('Demo data reset');
  }, [showToast]);

  // Real calls get logged with the real measured duration.
  const logCall = useCallback((entry) => {
    setCallLog((log) => [{ id: `call${Date.now()}`, ...entry }, ...log]);
  }, []);

  const value = {
    messages, sendMessage,
    needsInputAnswer, setNeedsInputAnswer,
    callLog, logCall,
    leadsModal, openLeads: (index = 0) => setLeadsModal({ open: true, index }),
    setLeadsIndex: (index) => setLeadsModal((s) => ({ ...s, index })),
    closeLeads: () => setLeadsModal((s) => ({ ...s, open: false })),
    dialer, openDialer: (mode = 'human', target = null) => setDialer({ open: true, mode, target }),
    closeDialer: () => setDialer((d) => ({ ...d, open: false })),
    toast, showToast,
    resetDemo,
  };
  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error('useAppState must be used inside AppStateProvider');
  return ctx;
}