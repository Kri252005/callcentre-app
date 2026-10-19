import { useCallback, useEffect, useRef, useState } from 'react';
import { practicePersona } from '../data/sampleData';

// AI-to-human practice call: a rule-based customer persona that SPEAKS (speechSynthesis)
// and LISTENS (SpeechRecognition) in the browser. It is deliberately not an LLM:
// replies come from keyword rules in practicePersona, so it works offline and is explainable.
// Typing is always available as a fallback when the browser has no speech recognition.

const SpeechRecognitionImpl =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export const speechSupport = {
  speak: typeof window !== 'undefined' && 'speechSynthesis' in window,
  listen: Boolean(SpeechRecognitionImpl),
};

export function pickReply(text) {
  const rule = practicePersona.rules.find((r) => r.match.test(text));
  return rule ? rule.reply : practicePersona.fallback;
}

export function usePracticeCall() {
  const [active, setActive] = useState(false);
  const [transcript, setTranscript] = useState([]);
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState('');
  const recogRef = useRef(null);
  const timerRef = useRef(null);
  const startRef = useRef(null);
  const activeRef = useRef(false);

  const speak = useCallback((text) => {
    if (!speechSupport.speak) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.onstart = () => setSpeaking(true);
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
  }, []);

  const say = useCallback((from, text) => {
    setTranscript((t) => [...t, { from, text, at: Date.now() }]);
  }, []);

  const respondTo = useCallback((userText) => {
    say('you', userText);
    const reply = pickReply(userText);
    setTimeout(() => {
      if (!activeRef.current) return;
      say('ai', reply);
      speak(reply);
    }, 500);
  }, [say, speak]);

  const start = useCallback(() => {
    setError('');
    setTranscript([]);
    activeRef.current = true;
    setActive(true);
    startRef.current = Date.now();
    setSeconds(0);
    timerRef.current = setInterval(() => setSeconds(Math.round((Date.now() - startRef.current) / 1000)), 500);
    say('ai', practicePersona.opening);
    speak(practicePersona.opening);
  }, [say, speak]);

  const stopListening = useCallback(() => {
    try { recogRef.current?.stop(); } catch { /* ignore */ }
    setListening(false);
  }, []);

  const listen = useCallback(() => {
    if (!SpeechRecognitionImpl) {
      setError('Voice input is not supported in this browser (use Chrome). You can type instead.');
      return;
    }
    window.speechSynthesis?.cancel();
    const recog = new SpeechRecognitionImpl();
    recog.lang = 'en-IN';
    recog.interimResults = false;
    recog.onresult = (e) => respondTo(e.results[0][0].transcript);
    recog.onerror = (e) => {
      setListening(false);
      setError(e.error === 'not-allowed' ? 'Microphone permission was blocked.' : `Voice input error: ${e.error}. You can type instead.`);
    };
    recog.onend = () => setListening(false);
    recogRef.current = recog;
    try {
      recog.start();
      setListening(true);
      setError('');
    } catch (e) {
      setError(`Could not start listening: ${e.message}`);
    }
  }, [respondTo]);

  const end = useCallback(() => {
    activeRef.current = false;
    clearInterval(timerRef.current);
    window.speechSynthesis?.cancel();
    stopListening();
    setActive(false);
    setSpeaking(false);
    const secs = startRef.current ? Math.round((Date.now() - startRef.current) / 1000) : 0;
    startRef.current = null;
    return secs;
  }, [stopListening]);

  useEffect(() => () => {
    activeRef.current = false;
    clearInterval(timerRef.current);
    window.speechSynthesis?.cancel();
    try { recogRef.current?.abort(); } catch { /* ignore */ }
  }, []);

  return { active, transcript, listening, speaking, seconds, error, start, end, listen, stopListening, respondTo };
}
