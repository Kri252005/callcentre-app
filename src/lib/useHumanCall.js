import { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'peerjs';

// Human-to-human in-app calling over WebRTC.
// PeerJS gives us a public signalling server (0.peerjs.com), so there is no backend of our own:
// signalling sets up the connection, then audio flows directly browser-to-browser.
//
// States: starting -> ready -> calling | ringing -> in-call -> ended   (or error)

const CODE_ALPHABET = 'abcdefghjkmnpqrstuvwxyz23456789';
const makeCode = () =>
  Array.from({ length: 6 }, () => CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)]).join('');
const ID_PREFIX = 'ogcc-';

const describeMicError = (err) => {
  if (!navigator.mediaDevices?.getUserMedia) return 'This browser cannot access a microphone (HTTPS or localhost required).';
  if (err?.name === 'NotAllowedError') return 'Microphone permission was blocked. Allow it in the address bar and try again.';
  if (err?.name === 'NotFoundError') return 'No microphone was found on this device.';
  return `Microphone error: ${err?.message || err}`;
};

export function useHumanCall(enabled) {
  const [status, setStatus] = useState('starting');
  const [myCode, setMyCode] = useState('');
  const [remoteCode, setRemoteCode] = useState('');
  const [error, setError] = useState('');
  const [seconds, setSeconds] = useState(0);
  const [muted, setMuted] = useState(false);
  const [lastCall, setLastCall] = useState(null); // {remoteCode, seconds, direction}

  const peerRef = useRef(null);
  const callRef = useRef(null);
  const localStreamRef = useRef(null);
  const audioRef = useRef(null);
  const startedAtRef = useRef(null);
  const directionRef = useRef('out');
  const incomingRef = useRef(null);
  const timerRef = useRef(null);
  const statusRef = useRef(status);
  useEffect(() => { statusRef.current = status; }, [status]);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  const cleanupCall = useCallback((finalStatus = 'ready') => {
    stopTimer();
    if (startedAtRef.current) {
      const secs = Math.round((Date.now() - startedAtRef.current) / 1000);
      setLastCall({ remoteCode: callRef.current?.peer?.replace(ID_PREFIX, '') ?? '', seconds: secs, direction: directionRef.current });
    }
    startedAtRef.current = null;
    callRef.current = null;
    incomingRef.current = null;
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (audioRef.current) audioRef.current.srcObject = null;
    setMuted(false);
    setSeconds(0);
    setStatus(finalStatus);
  }, []);

  const attachCall = useCallback((call) => {
    callRef.current = call;
    call.on('stream', (remoteStream) => {
      if (audioRef.current) {
        audioRef.current.srcObject = remoteStream;
        audioRef.current.play().catch(() => {});
      }
      startedAtRef.current = Date.now();
      timerRef.current = setInterval(() => setSeconds(Math.round((Date.now() - startedAtRef.current) / 1000)), 500);
      setStatus('in-call');
    });
    call.on('close', () => cleanupCall('ended'));
    call.on('error', (e) => {
      setError(`Call failed: ${e?.message || e}`);
      cleanupCall('ready');
    });
  }, [cleanupCall]);

  // Create the peer once the dialer is opened.
  useEffect(() => {
    if (!enabled || peerRef.current) return undefined;
    const code = makeCode();
    const peer = new Peer(ID_PREFIX + code);
    peerRef.current = peer;
    const openTimeout = setTimeout(() => {
      if (statusRef.current === 'starting') {
        setError('Could not reach the signalling server. Check your internet connection and reopen the dialer.');
        setStatus('error');
      }
    }, 10000);
    peer.on('open', () => {
      clearTimeout(openTimeout);
      setMyCode(code);
      setStatus('ready');
    });
    peer.on('call', (incoming) => {
      if (statusRef.current !== 'ready' && statusRef.current !== 'ended') {
        incoming.close(); // already busy
        return;
      }
      incomingRef.current = incoming;
      directionRef.current = 'in';
      setRemoteCode(incoming.peer.replace(ID_PREFIX, ''));
      setStatus('ringing');
    });
    peer.on('error', (e) => {
      clearTimeout(openTimeout);
      if (e.type === 'peer-unavailable') {
        setError('That code is not online. Ask the other person to open the dialer and share their code.');
        cleanupCall('ready');
        return;
      }
      setError(`Connection problem: ${e.type || e.message}`);
      if (statusRef.current === 'starting') setStatus('error');
    });
    peer.on('disconnected', () => {
      if (statusRef.current === 'ready') {
        try { peer.reconnect(); } catch { /* ignore */ }
      }
    });
    return undefined;
  }, [enabled, cleanupCall]);

  // Destroy the peer when the whole app unmounts.
  useEffect(() => () => {
    clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerRef.current?.destroy();
    peerRef.current = null;
  }, []);

  const getMic = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    localStreamRef.current = stream;
    return stream;
  };

  const dial = useCallback(async (code) => {
    const clean = code.trim().toLowerCase().replace(ID_PREFIX, '');
    setError('');
    if (!/^[a-z0-9]{6}$/.test(clean)) {
      setError('Enter the 6-character code shown on the other device.');
      return;
    }
    if (clean === myCode) {
      setError('That is your own code. Open the app on a second device or browser tab to call.');
      return;
    }
    if (!peerRef.current || statusRef.current !== 'ready') {
      setError('Not connected yet. Wait for "Ready" and try again.');
      return;
    }
    try {
      const stream = await getMic();
      directionRef.current = 'out';
      setRemoteCode(clean);
      setStatus('calling');
      attachCall(peerRef.current.call(ID_PREFIX + clean, stream));
    } catch (e) {
      setError(describeMicError(e));
      cleanupCall('ready');
    }
  }, [attachCall, cleanupCall, myCode]);

  const answer = useCallback(async () => {
    if (!incomingRef.current) return;
    try {
      const stream = await getMic();
      incomingRef.current.answer(stream);
      attachCall(incomingRef.current);
    } catch (e) {
      setError(describeMicError(e));
      incomingRef.current?.close();
      cleanupCall('ready');
    }
  }, [attachCall, cleanupCall]);

  const hangUp = useCallback(() => {
    if (callRef.current) callRef.current.close();
    else if (incomingRef.current) incomingRef.current.close();
    cleanupCall('ended');
  }, [cleanupCall]);

  const toggleMute = useCallback(() => {
    const tracks = localStreamRef.current?.getAudioTracks() ?? [];
    const next = !muted;
    tracks.forEach((t) => { t.enabled = !next; });
    setMuted(next);
  }, [muted]);

  return {
    status, myCode, remoteCode, setRemoteCode, error, setError,
    seconds, muted, lastCall, audioRef,
    dial, answer, hangUp, toggleMute,
  };
}

export const formatDuration = (s) => `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, '0')}s`;
