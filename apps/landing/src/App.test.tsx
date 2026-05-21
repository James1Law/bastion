import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the brand and primary CTA', () => {
    render(<App />);
    expect(screen.getByRole('img', { name: /bastion/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/security-first IDE/i);
    expect(screen.getByRole('link', { name: /join the waitlist/i })).toBeInTheDocument();
  });
});
