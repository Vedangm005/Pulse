import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider, useTheme } from '../src/context/ThemeContext';
import { AuthProvider } from '../src/context/AuthContext';
import { Navbar } from '../src/components/layout/Navbar';
import { Footer } from '../src/components/layout/Footer';

// Helper component to test ThemeProvider
const ThemeConsumer = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div>
      <span data-testid="current-theme">{theme}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
};

describe('Foundation & Design System Tests', () => {
  it('toggles theme correctly between dark and light', () => {
    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    const themeSpan = screen.getByTestId('current-theme');
    const initialTheme = themeSpan.textContent;
    expect(['dark', 'light']).toContain(initialTheme);

    const toggleButton = screen.getByRole('button', { name: /toggle theme/i });
    fireEvent.click(toggleButton);

    const newTheme = themeSpan.textContent;
    expect(newTheme).not.toBe(initialTheme);
    expect(document.documentElement.dataset.theme).toBe(newTheme);
    expect(localStorage.getItem('kexp_theme_v2')).toBe(newTheme);
  });

  it('renders Navbar with PULSE brand logo and core links', () => {
    render(
      <ThemeProvider>
        <AuthProvider>
          <Navbar activeTicketCount={2} />
        </AuthProvider>
      </ThemeProvider>
    );

    expect(screen.getByText(/PULSE/i)).toBeInTheDocument();
    expect(screen.getByText(/Browse Events/i)).toBeInTheDocument();
    expect(screen.getByText(/Featured/i)).toBeInTheDocument();

    const themeButton = screen.getByRole('button', { name: /switch to light mode/i });
    fireEvent.click(themeButton);
    expect(document.documentElement.dataset.theme).toBe('light');
    expect(screen.getByRole('button', { name: /switch to dark mode/i })).toBeInTheDocument();
  });

  it('renders a visitor-facing footer without developer metadata', () => {
    render(<Footer />);
    expect(screen.getByText(/Discover events, connect with people/i)).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: /discover/i })).toBeInTheDocument();
    expect(screen.queryByText(/Zero-Config Jamstack/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Static Production Build Ready/i)).not.toBeInTheDocument();
  });
});
