import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Footer } from './Footer';

describe('Footer Component', () => {
  it('should render the footer text correctly', () => {
    render(<Footer />);
    expect(screen.getByText(/VoxChain — On-Chain Governance/i)).toBeInTheDocument();
  });
});
