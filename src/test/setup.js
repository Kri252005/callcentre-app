import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
  localStorage.clear();
  window.location.hash = '';
});

// jsdom lacks these browser APIs
window.HTMLElement.prototype.scrollIntoView = vi.fn();
global.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };

// Stub PeerJS: the real WebRTC path needs two real browsers (documented in README).
vi.mock('peerjs', () => {
  class FakePeer {
    constructor(id) { this.id = id; this.handlers = {}; setTimeout(() => this.handlers.open?.(id), 0); }
    on(evt, fn) { this.handlers[evt] = fn; }
    call() { return { on() {}, close() {} }; }
    destroy() {}
    reconnect() {}
  }
  return { default: FakePeer };
});
