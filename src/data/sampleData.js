// All sample data for the demo. No backend: this module is the "database".
// Phone numbers use the reserved fictional range 555-01xx style so nothing real is dialled.

export const agent = {
  name: 'Arvind Rajan',
  initials: 'AR',
  company: 'The Sleep Company',
  team: 'Call Centre',
  streak: 12,
  points: 417,
};

export const kpis = [
  { id: 'qa', label: 'QA score', value: '76', delta: '+4', tone: 'good' },
  { id: 'aht', label: 'Avg handle time', value: '4m 12s', delta: '-19s', tone: 'good' },
  { id: 'conv', label: 'Conversion today', value: '34%', delta: '+6%', tone: 'good' },
  { id: 'queue', label: 'In queue', value: '2', delta: 'live', tone: 'warn' },
];

export const progress = {
  leadsCalled: 3,
  leadsTarget: 5,
  leadsClosed: 2,
  earningsMonth: 5200,
  earningsTarget: 8000,
  earningsPending: 1750,
};

export const waiting = [
  { id: 'w1', name: 'Priya Iyer', note: 'Delivery dispute — Nagarbhavi', wait: '4m 20s', tone: 'bad' },
  { id: 'w2', name: 'Suresh Nair', note: 'Plan upgrade enquiry', wait: '1m 05s', tone: 'warn' },
];

export const tasks = [
  { id: 't1', icon: '☎', title: '2 callbacks', sub: 'due 4:30pm', kind: 'callbacks' },
  { id: 't2', icon: '★', title: '2 hot leads', sub: 'unactioned (6h)', kind: 'leads' },
  { id: 't3', icon: '✓', title: '1 outcome', sub: 'to log', kind: 'outcome' },
];

export const callsHandled7d = [
  { day: 'Wed', value: 18 },
  { day: 'Thu', value: 21 },
  { day: 'Fri', value: 15 },
  { day: 'Sat', value: 24 },
  { day: 'Sun', value: 19 },
  { day: 'Mon', value: 12 },
  { day: 'Today', value: 14 },
];

export const csatTrend7d = [
  { day: 'Wed', value: 88 },
  { day: 'Thu', value: 90 },
  { day: 'Fri', value: 85 },
  { day: 'Sat', value: 91 },
  { day: 'Sun', value: 89 },
  { day: 'Mon', value: 92 },
  { day: 'Today', value: 94 },
];

// Leads: ranked by score on the "Calls to make" screen.
export const leads = [
  {
    id: 'l1', name: 'Mukunda', initials: 'MK', interest: 'Ortho GRID — ₹5,490', value: 5490,
    phone: '+91 98450 00101', icp: 87, intent: 91, hoursLeft: 3, status: 'Open',
    quote: 'Quote to be given to customer',
    missed: 2, missedNote: 'expired without close, visible to manager',
    breakdown: [
      { k: 'Budget fit', v: 'High — within ₹4–6k band' },
      { k: 'Household', v: 'Couple, 2 adults, 1 bed' },
      { k: 'Timeline', v: 'Wants delivery this month' },
    ],
    how: 'Walked into the Indiranagar store on Saturday, tried 3 mattresses, left a number with the floor staff.',
    signals: [
      { icon: '₹', title: 'Financing Related', text: 'Asked specifically about EMI options on the Ortho GRID — budget is a live concern, not a blocker' },
      { icon: '⚖', title: 'Quotation Demanded', text: 'Compared pricing with a competitor before reaching out — price-anchored, expects a competitive number' },
      { icon: '🛡', title: 'Warranty Related', text: "Haven't raised this yet — worth proactively mentioning the 100-night trial to reduce perceived risk" },
    ],
  },
  {
    id: 'l2', name: 'Ritu S.', initials: 'RS', interest: 'Interested: Luxe Bedroom — ₹12,400', value: 12400,
    phone: '+91 98450 00102', icp: 82, intent: 84, hoursLeft: 5, status: 'Open',
    quote: 'Send revised quote on WhatsApp',
    missed: 1, missedNote: 'one callback slipped yesterday',
    breakdown: [
      { k: 'Budget fit', v: 'Medium — asked for a discount' },
      { k: 'Household', v: 'Family of 4' },
      { k: 'Timeline', v: 'Decides within 2 weeks' },
    ],
    how: 'Enquired via the website chat, then visited the Jayanagar store with her husband.',
    signals: [
      { icon: '₹', title: 'Financing Related', text: 'Asked whether 6-month no-cost EMI applies to the full bundle' },
      { icon: '⚖', title: 'Quotation Demanded', text: 'Requested a written quote twice' },
    ],
  },
  {
    id: 'l3', name: 'Mukunda D.', initials: 'MD', interest: 'Interested: Smart Grid Pillow — ₹3,490', value: 3490,
    phone: '+91 98450 00103', icp: 74, intent: 69, hoursLeft: 9, status: 'Open',
    quote: 'Share pillow comparison sheet',
    missed: 0, missedNote: '',
    breakdown: [
      { k: 'Budget fit', v: 'High' },
      { k: 'Household', v: 'Single' },
      { k: 'Timeline', v: 'Browsing' },
    ],
    how: 'Picked up a flyer at a mall kiosk and scanned the QR code.',
    signals: [{ icon: '🛡', title: 'Warranty Related', text: 'Asked how long the pillow keeps its shape' }],
  },
  {
    id: 'l4', name: 'Anita Rao', initials: 'AR', interest: 'Interested: Sofa-cum-bed — ₹18,900', value: 18900,
    phone: '+91 98450 00104', icp: 70, intent: 66, hoursLeft: 14, status: 'Open',
    quote: 'Confirm fabric samples delivered',
    missed: 0, missedNote: '',
    breakdown: [
      { k: 'Budget fit', v: 'Medium' },
      { k: 'Household', v: 'Small apartment' },
      { k: 'Timeline', v: 'Moving in 3 weeks' },
    ],
    how: 'Visited the store with floor plan photos and asked for a space-saving option.',
    signals: [{ icon: '₹', title: 'Financing Related', text: 'Asked about a 12-month EMI plan' }],
  },
  {
    id: 'l5', name: 'Vikram Shetty', initials: 'VS', interest: 'Interested: Recliner — ₹24,000', value: 24000,
    phone: '+91 98450 00105', icp: 66, intent: 58, hoursLeft: 20, status: 'Open',
    quote: 'Offer a store visit this weekend',
    missed: 0, missedNote: '',
    breakdown: [
      { k: 'Budget fit', v: 'Medium' },
      { k: 'Household', v: 'Family of 3' },
      { k: 'Timeline', v: 'Gift for parents, no rush' },
    ],
    how: 'Referred by an existing customer.',
    signals: [{ icon: '⚖', title: 'Quotation Demanded', text: 'Wants to compare with a local carpenter quote' }],
  },
  {
    id: 'l6', name: 'Neha Kapoor', initials: 'NK', interest: 'Interested: Kids Mattress — ₹7,200', value: 7200,
    phone: '+91 98450 00106', icp: 61, intent: 55, hoursLeft: 26, status: 'Open',
    quote: 'Explain the hypoallergenic cover',
    missed: 0, missedNote: '',
    breakdown: [
      { k: 'Budget fit', v: 'High' },
      { k: 'Household', v: 'Family of 3' },
      { k: 'Timeline', v: 'Next month' },
    ],
    how: 'Called the toll-free number after seeing an Instagram reel.',
    signals: [{ icon: '🛡', title: 'Warranty Related', text: 'Asked about warranty on the waterproof layer' }],
  },
  {
    id: 'l7', name: 'Rahul Menon', initials: 'RM', interest: 'Interested: King Mattress — ₹21,000', value: 21000,
    phone: '+91 98450 00107', icp: 58, intent: 52, hoursLeft: 30, status: 'Open',
    quote: 'Follow up on the delivery pincode',
    missed: 0, missedNote: '',
    breakdown: [
      { k: 'Budget fit', v: 'Low-medium' },
      { k: 'Household', v: 'Couple' },
      { k: 'Timeline', v: 'Undecided' },
    ],
    how: 'Online enquiry form.',
    signals: [{ icon: '₹', title: 'Financing Related', text: 'Asked about the cheapest EMI tenure' }],
  },
];

// Incoming: missed calls with value at stake.
export const missedCalls = [
  { id: 'm1', name: 'Faizan A.', phone: '+91 98450 00201', when: 'Missed Today 10:06 AM', context: 'Hottest lead', value: 24000, expires: '2h' },
  { id: 'm2', name: 'Kavitha R.', phone: '+91 98450 00202', when: 'Missed Yesterday 6:42 PM', context: 'Warm lead', value: 21000, expires: '6h' },
  { id: 'm3', name: 'Divya P.', phone: '+91 98450 00203', when: 'Missed Yesterday 2:10 PM', context: 'Chat lead', value: 18000, expires: '9h' },
  { id: 'm4', name: 'Ritu S.', phone: '+91 98450 00102', when: 'Missed Today 11:20 AM', context: 'Visited store', value: 12000, expires: '12h' },
  { id: 'm5', name: 'Unknown', phone: '+91 98450 00299', when: 'Missed Yesterday', context: 'No prior record', value: 0, expires: '' },
];

// Recent: calls by type, time and length.
export const recentCalls = [
  { id: 'r1', name: 'Mukunda R.', phone: '+91 98450 00101', type: 'out', when: '10:42 AM', length: '2m 04s', outcome: 'Interested', notes: 'Wants EMI breakdown; send on WhatsApp.' },
  { id: 'r2', name: 'Kavitha R.', phone: '+91 98450 00202', type: 'in', when: 'Yesterday · 1m 55s', length: '1m 55s', outcome: 'Callback', notes: 'Asked to call after 6pm.' },
  { id: 'r3', name: 'Unknown', phone: '+91 98450 00299', type: 'missed', when: 'Yesterday', length: '—', outcome: 'Missed', notes: '' },
  { id: 'r4', name: 'Ritu S.', phone: '+91 98450 00102', type: 'out', when: 'Today · 11:20 AM', length: '3m 40s', outcome: 'Interested', notes: 'Comparing Luxe vs Premium bedroom set.' },
  { id: 'r5', name: 'Faizan A.', phone: '+91 98450 00201', type: 'missed', when: 'Today · 10:06 AM', length: '—', outcome: 'Missed', notes: '' },
  { id: 'r6', name: 'Kavitha R.', phone: '+91 98450 00202', type: 'in', when: 'Yesterday · 6:42 PM', length: '4m 18s', outcome: 'Quote sent', notes: 'Quote sent for 3-seater sofa.' },
  { id: 'r7', name: 'Divya P.', phone: '+91 98450 00203', type: 'out', when: 'Yesterday · 2:10 PM', length: '0m 38s', outcome: 'No answer', notes: 'Voicemail.' },
  { id: 'r8', name: 'Faizan A.', phone: '+91 98450 00201', type: 'in', when: 'Mon · 4:50 PM', length: '5m 02s', outcome: 'Not interested', notes: 'Bought elsewhere.' },
];

// Calendar events keyed by ISO date (October 2026).
export const calendarEvents = [
  { date: '2026-10-09', title: 'Team huddle', time: '10:00 AM', kind: 'meeting' },
  { date: '2026-10-20', title: 'Callback — Priya Iyer', time: '4:30 PM', kind: 'callback' },
  { date: '2026-10-20', title: 'Coaching session with Sunita', time: '5:30 PM', kind: 'coaching' },
  { date: '2026-10-23', title: 'Follow-up batch — hot leads', time: '11:00 AM', kind: 'followup' },
  { date: '2026-10-26', title: 'Callback — Ritu S.', time: '3:00 PM', kind: 'callback' },
  { date: '2026-10-28', title: 'Monthly QA review', time: '2:00 PM', kind: 'meeting' },
];

// Pulse
export const pulse = {
  workspace: 'The Sleep Company · Knowledge hub',
  avaniBot: 'Ask me about anything happening in Pulse — daily briefs, action items, open questions.',
  roleAgents: [{ id: 'callcentre-agent', name: '# callcentre-agent', sub: 'Call Centre Agent', unread: 3 }],
  taskAgents: [
    { id: 'cross-sell-agent', name: '# cross-sell-agent', sub: 'Your next best offer · 4 members', pct: 24, tone: 'bad' },
    { id: 'sop-agent', name: '# sop-agent', sub: 'Your SOP adherence · 5 members', pct: 81, tone: 'good' },
    { id: 'lead-conversion-agent', name: '# lead-conversion-agent', sub: 'Lead Conversion Agent', pct: 58, tone: 'warn' },
    { id: 'capture-agent', name: '# capture-agent', sub: 'Your Capture coverage · 3 members', pct: 79, tone: 'good' },
  ],
  general: [{ id: 'customer-discussions', name: 'customer-discussions', sub: 'Relayed via WhatsApp Business' }],
  kudos: { title: 'Kudos', sub: 'Team members shouting each other out', count: 3 },
};

export const channels = {
  'callcentre-team': {
    id: 'callcentre-team',
    title: '#callcentre-team',
    needsInput: {
      id: 'ni1',
      title: 'Confirm the 4:30pm callback',
      sub: 'Priya Iyer · likely billing dispute',
      options: ['Confirmed', 'Reschedule'],
    },
    messages: [
      { id: 'c1', from: 'Sunita Rao', initials: 'SR', time: '2:00pm', tag: 'STAKEHOLDERS', text: '@You (Arvind R.), whole call centre shift' },
      { id: 'c2', from: 'Sunita Rao', initials: 'SR', time: '2:00pm', tag: 'ISSUE DEFINITION', text: 'Greeting-in-first-10s QA score is at 71% this week, below our 85% target.' },
      { id: 'c3', from: 'Sunita Rao', initials: 'SR', time: '2:00pm', tag: 'SUGGESTED RESOLUTION', text: "Let's push that up 💪 — open every call with the greeting script. I'll check back Friday." },
      { id: 'c4', from: 'You', initials: 'AR', time: '2:10pm', mine: true, text: "On it! Will make sure I open every call with the greeting script 🙌" },
      { id: 'c5', from: 'Sunita Rao', initials: 'SR', time: '2:14pm', text: 'Great attitude Arvind 🌟' },
    ],
  },
};

// Persona for the AI practice call (rule-based, no model call).
export const practicePersona = {
  name: 'Meera (practice customer)',
  opening: "Hello? Yes, this is Meera. I enquired about a mattress last week. Who's calling?",
  rules: [
    { match: /(sleep company|from the sleep|calling from)/i, reply: "Oh right, the Sleep Company. I was looking at the Ortho mattress. What's the price again?" },
    { match: /(price|cost|₹|rupees|rs\.?)/i, reply: 'Hmm, that sounds a bit high. Another store quoted me less. Can you do anything on the price?' },
    { match: /(emi|instal|finance|no.cost)/i, reply: 'EMI could work. What would the monthly payment be, and is there any interest?' },
    { match: /(trial|100.night|warranty|guarantee)/i, reply: 'A 100-night trial is reassuring. How does the return work if I do not like it?' },
    { match: /(visit|store|come|weekend)/i, reply: 'I can come this Saturday morning. Will somebody help me try the mattresses?' },
    { match: /(thank|bye|goodbye)/i, reply: 'Thanks for calling. Please send me the details on WhatsApp. Bye!' },
  ],
  fallback: 'Sorry, could you say that again? I am not sure I understood.',
};
