import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';

const go = (hash) => { window.location.hash = hash; };
const setup = (hash = '#/') => { go(hash); return { user: userEvent.setup(), ...render(<App />) }; };

describe('App shell and navigation', () => {
  it('renders the sidebar, top bar and dashboard', () => {
    setup();
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
    expect(screen.getByText('Arvind Rajan')).toBeInTheDocument();
    expect(screen.getByText(/my earnings this month/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Key numbers').children).toHaveLength(4);
  });

  it('navigates Plan -> Incoming -> Recent', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('link', { name: 'Plan' }));
    expect(screen.getByText('Planned outgoing calls')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Incoming' }));
    expect(screen.getByText('Missed calls')).toBeInTheDocument();
    await user.click(screen.getByRole('link', { name: 'Recent' }));
    expect(screen.getByText('Recent calls')).toBeInTheDocument();
  });
});

describe('Calls to make', () => {
  it('ranks by score, pages, and expands rows', async () => {
    const { user } = setup('#/plan/calls');
    const rows = screen.getAllByRole('listitem');
    expect(rows[0]).toHaveTextContent('Mukunda'); // intent 91 is highest
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next page' }));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    await user.click(screen.getAllByRole('button', { expanded: false })[0]);
    expect(screen.getByText(/Next step:/)).toBeInTheDocument();
  });
});

describe('Incoming and Recent', () => {
  it('shows value at stake and a call back on every row', () => {
    setup('#/plan/incoming');
    expect(screen.getAllByRole('button', { name: /call back/i })).toHaveLength(5);
    expect(screen.getByText('₹75,000')).toBeInTheDocument();
  });

  it('lets you tap a recent call to review it', async () => {
    const { user } = setup('#/plan/recent');
    await user.click(screen.getByRole('button', { name: /Mukunda R\./ }));
    expect(screen.getByText(/Wants EMI breakdown/)).toBeInTheDocument();
  });
});

describe('Calendar', () => {
  it('switches month and returns with Today', async () => {
    const { user } = setup('#/calendar');
    const label = () => screen.getByText(/\d{4}$/, { selector: 'b' }).textContent;
    const start = label();
    await user.click(screen.getByRole('button', { name: 'Next month' }));
    expect(label()).not.toBe(start);
    await user.click(screen.getByRole('button', { name: 'Today' }));
    expect(label()).toBe(start);
  });
});

describe('Pulse', () => {
  it('opens the channel, answers the needs-input card and sends a message', async () => {
    const { user } = setup('#/pulse');
    await user.click(screen.getAllByRole('link', { name: /callcentre/i })[0]);
    expect(screen.getByText('Confirm the 4:30pm callback')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Confirmed' }));
    expect(screen.getByText(/You answered/)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/message #callcentre-team/i), 'Hello team');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    expect(screen.getByText('Hello team')).toBeInTheDocument();
  });

  it('shows a message when the channel does not exist', () => {
    setup('#/pulse/nope');
    expect(screen.getByText('Channel not found.')).toBeInTheDocument();
  });
});

describe('Leads modal', () => {
  it('opens from the task list and pages next/previous', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: /2 hot leads/i }));
    const dialog = screen.getByRole('dialog', { name: 'Leads' });
    expect(within(dialog).getByText(/Lead 1 of 7/)).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: 'Previous lead' })).toBeDisabled();
    await user.click(within(dialog).getByRole('button', { name: 'Next lead' }));
    expect(within(dialog).getByText(/Lead 2 of 7/)).toBeInTheDocument();
    // collapsible signals
    await user.click(within(dialog).getByRole('button', { name: /ICP FIT BREAKDOWN/ }));
    expect(within(dialog).getByText(/Budget fit/)).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog', { name: 'Leads' })).not.toBeInTheDocument();
  });
});

describe('Calling dialer', () => {
  it('shows ready state and a call code once connected', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'In-app call' }));
    await waitFor(() => expect(screen.getByRole('status', { name: '' })).toBeDefined());
    await waitFor(() => expect(screen.getByText('Ready')).toBeInTheDocument());
    expect(screen.getByLabelText('Your call code').textContent).toMatch(/^[a-z0-9]{6}$/);
  });

  it('rejects an invalid code and your own code with clear errors', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'In-app call' }));
    await waitFor(() => expect(screen.getByText('Ready')).toBeInTheDocument());
    const input = screen.getByLabelText(/other person's code/i);
    await user.type(input, 'abc');
    await user.click(screen.getByRole('button', { name: 'Call' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/6-character code/);

    await user.clear(input);
    await user.type(input, screen.getByLabelText('Your call code').textContent);
    await user.click(screen.getByRole('button', { name: 'Call' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/your own code/i);
  });

  it('starts an AI practice call and replies by rule', async () => {
    const { user } = setup();
    await user.click(screen.getByRole('button', { name: 'Practice call' }));
    await user.click(screen.getByRole('button', { name: /start practice call/i }));
    expect(screen.getByText(/this is Meera/)).toBeInTheDocument();
    await user.type(screen.getByLabelText(/type your reply/i), 'We have EMI plans');
    await user.click(screen.getByRole('button', { name: 'Send' }));
    await waitFor(() => expect(screen.getByText(/monthly payment/)).toBeInTheDocument());
  });
});
