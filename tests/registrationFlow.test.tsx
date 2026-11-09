import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../src/App';

describe('End-to-End Registration & Interaction Flow', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders landing hero, bento spotlight, and event catalog', () => {
    render(<App />);

    expect(screen.getByText(/Curate\. Connect\./i)).toBeInTheDocument();
    expect(screen.getByText(/All Upcoming Gatherings/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Search by event title, venue, or keyword/i)).toBeInTheDocument();
  });

  it('filters events when user types into the search box', async () => {
    render(<App />);

    const searchInput = screen.getByPlaceholderText(/Search by event title, venue, or keyword/i);
    fireEvent.change(searchInput, { target: { value: 'Cybersecurity' } });

    await waitFor(() => {
      const matches = screen.getAllByText(/Cybersecurity & Ethical Hacking Bootcamp/i);
      expect(matches.length).toBeGreaterThan(0);
    });
  });

  it('opens registration modal when clicking Register on an event card', async () => {
    render(<App />);

    // Find a register button
    const registerButtons = screen.getAllByRole('button', { name: /^register$/i });
    expect(registerButtons.length).toBeGreaterThan(0);

    fireEvent.click(registerButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Official Registration Form/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    });
  });

  it('displays inline validation error if name is empty and submitted', async () => {
    render(<App />);

    const registerButtons = screen.getAllByRole('button', { name: /^register$/i });
    fireEvent.click(registerButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/Official Registration Form/i)).toBeInTheDocument();
    });

    // Clear name input to trigger validation
    const nameInput = screen.getByLabelText(/Full Name/i);
    fireEvent.change(nameInput, { target: { value: '' } });

    const submitBtn = screen.getByRole('button', { name: /confirm free registration/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters long/i)).toBeInTheDocument();
    });
  });
});
