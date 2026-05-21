import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the hero with brand, headline, CTAs, and security mockup', () => {
    render(<App />);

    expect(screen.getByRole('img', { name: /bastion/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/security-first IDE/i);
    expect(screen.getByRole('link', { name: /join the waitlist/i })).toHaveAttribute(
      'href',
      '#waitlist',
    );
    expect(screen.getByRole('link', { name: /see how it works/i })).toHaveAttribute('href', '#how');
    expect(screen.getByRole('heading', { name: /security overview/i })).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: /it does not make them safer/i }),
    ).toBeInTheDocument();
  });
});
