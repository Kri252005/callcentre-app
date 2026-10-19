# On-Ground.ai Call Centre App (assignment rebuild)

A call-centre agent's workspace: dashboard, call plan, missed calls, recent calls, calendar, the Pulse team chat and a leads card. It includes **real in-app calling**: human-to-human voice over WebRTC, plus an AI-customer practice call you can speak to.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 12 UI tests
npm run build      # production build in dist/
```

Node 20+ recommended. Microphone access needs `localhost` or HTTPS. To test on a phone, deploy `dist/` to any static host (Vercel, Netlify, GitHub Pages) and open that URL on both devices.

## Stack and why

- **React + Vite**: React was the preferred stack; Vite keeps setup and rebuilds fast.
- **React Router (HashRouter)**: works on any static host with no rewrite rules.
- **Recharts**: the two 7-day charts on the dashboard.
- **PeerJS**: a thin wrapper over WebRTC with a free public signalling server, so calling works with **no backend of ours**, as the brief requires.
- **Plain CSS** (one file, CSS variables): small type sizes close to the mock, no UI kit.
- **Vitest + Testing Library**: UI tests.

Data lives in `src/data/sampleData.js` (a local module, all sample data). Chat messages, the "Needs your input" answer and the call log persist in `localStorage`.

## What is done

Must build
- [x] App shell: sidebar, top bar (collapses to a hamburger menu on phones)
- [x] Dashboard: KPI cards, progress, who is waiting, earnings, tasks, two 7-day charts
- [x] Plan > Calls to make: leads ranked by score, expandable rows, paging
- [x] Plan > Incoming: missed calls with value at stake, Call back on every row
- [x] Plan > Recent: calls by type, time and length; tap a call to review it
- [x] Calendar: month grid, event dots, Today button, month switcher, day agenda
- [x] Pulse home: AvaniBot, role and task agents, channels, Kudos, search
- [x] Pulse channel: back button, pinned "Needs your input" card, chat bubbles
- [x] Leads modal opened from the dashboard task list: ICP and intent scores, collapsible buying signals, next/previous paging (also arrow keys and Esc)

Bonus
- [x] Send a message in a channel
- [x] Answer the "Needs your input" card (buttons or typed reply, with undo)
- [x] Practise a call and Call back
- [x] Works at phone width
- [x] Charts with a library (Recharts)

## How calling works

There are three ways to call, and I want to be exact about what each one is.

1. **In-app human-to-human call (real).** Opening the dialer creates a PeerJS peer with a random 6-character code. The public PeerJS signalling server introduces two browsers, then **audio flows directly between them over WebRTC** (`getUserMedia` for the mic, `RTCPeerConnection` under PeerJS). One person shares their code, the other types it and presses Call; the first one sees a ringing card with Answer/Decline. There is mute and hang-up. The call length is measured from the moment remote audio arrives, and the finished call is added to **Plan > Recent**. Code: `src/lib/useHumanCall.js`.
   - Limitation: it connects to *another browser running this app*, not to a real customer's phone number. Reaching a phone number needs a telephony provider (Twilio, Exotel) and a server for secrets, which the "no backend" rule rules out.
2. **Phone call (real hand-off).** Every lead has a **Phone** / **Dial on phone** button that is a `tel:` link, so a phone or a softphone app on the laptop dials the number. The numbers in the sample data are fictional.
3. **AI-to-human practice call.** "Practice a call" starts a call with an AI customer (Meera). She **speaks** using the browser's speech synthesis, and you reply by **voice** (browser speech recognition, Chrome) or by typing. Her replies come from **keyword rules**, not a language model (`practicePersona` in the data file), so it is predictable and works offline. Practice calls are logged to Recent.

## Not done / known limits

- **I could not run a real two-device call in my build environment** (no browser available there). The WebRTC path is implemented and the UI states and validation are tested against a stubbed PeerJS, but **you should do one real two-device call before recording the demo**: open the app on laptop and phone (or two tabs), and call one from the other.
- The public PeerJS server is free and best-effort. Behind strict corporate or school networks the audio can fail without a TURN server.
- The mock HTML file was not in the files I worked from; I matched the layout using the screenshots in the assignment PDF. Compare against the mock once and adjust spacing and colours if needed.
- The DEMO strip is replaced by a smaller "CALL" strip with the floating dial button; Kudos and task-agent rows show a toast instead of opening a screen.
- Sample numbers differ slightly from the mock (for example the missed-call total).

## AI tools used

Claude (Anthropic) assisted with planning, generating code and writing tests. I reviewed and can explain the code.

## Project structure

```
src/
  data/sampleData.js      sample data (the "database")
  state/AppState.jsx      shared state: messages, call log, modals, toast
  lib/useHumanCall.js     WebRTC calling via PeerJS
  lib/usePracticeCall.js  AI practice call (speech in/out + rules)
  components/             Shell, Dialer, LeadsModal
  pages/                  Dashboard, Plan (3 screens), Calendar, Pulse (2 screens)
  test/                   Vitest UI tests
```
