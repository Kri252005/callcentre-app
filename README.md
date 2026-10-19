# On-Ground.ai Call Centre App (assignment rebuild)

**Submitted by:** YOUR FULL NAME
**Live demo:** https://callcentre-app.vercel.app
**Repo:** https://github.com/Kri252005/callcentre-app

A call-centre agent's workspace: dashboard, call plan, missed calls, recent calls, calendar, the Pulse team chat and a leads card. It includes **real in-app calling**: human-to-human voice over WebRTC, plus an AI-customer practice call you can speak to.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 12 UI tests (on Windows use: npx vitest run --pool=threads)
npm run build      # production build in dist/
npm run preview    # serve the production build locally
```

Node 20+ recommended. Microphone access needs `localhost` or HTTPS. The live demo above is on Vercel (HTTPS), so it can be opened on a phone and a laptop to test calling.

## Stack and why

- **React + Vite**: React was the preferred stack; Vite keeps setup and rebuilds fast.
- **React Router (HashRouter)**: works on any static host with no rewrite rules.
- **Recharts**: the two 7-day charts on the dashboard.
- **PeerJS**: a thin wrapper over WebRTC with a free public signalling server, so calling works with **no backend of ours**, as the brief requires.
- **Plain CSS** (one file, CSS variables): small type sizes close to the mock, no UI kit.
- **Vitest + Testing Library**: UI tests.

Data lives in `src/data/sampleData.js` (a local module, all sample data). Chat messages, the "Needs your input" answer and the call log persist in `localStorage`. A "Reset demo data" link in the sidebar clears them.

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

## What I tested

- **Two-tab call on one laptop (Chrome): worked.** One tab called the other using the code, the call connected, and an entry with its measured length appeared in Plan > Recent.
- **Laptop-to-phone call on the live link: NOT YET TESTED.** (Edit this line with the real result.)
- Unit/UI tests: 12 passing (the PeerJS calls are stubbed in tests).
- The practice call's speech was tried in Chrome only. Speech recognition is Chrome-specific.

## Not done / known limits

- The public PeerJS server is free and best-effort. There is no TURN server, so behind strict corporate or school networks the audio can fail.
- In-app calls reach another browser running the app, not a real phone number (see above).
- I did not have the mock HTML file; I matched the layout using the screenshots in the assignment PDF, so spacing and colours will differ in places.
- The DEMO strip is replaced by a smaller "CALL" strip with the floating dial button; Kudos and task-agent rows show a toast instead of opening a screen.
- Some values are static (the top-bar call badge, the "In queue" KPI, task counts), and sample numbers differ slightly from the mock (for example the missed-call total).
- The production bundle is one chunk of about 770 KB (a size warning only).

## AI tools used

Claude (Anthropic) assisted with planning, generating code and writing tests. I reviewed the code and can explain it.

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