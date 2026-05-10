import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import AboutPage from './page';

describe('About Page', () => {
  it('should render the about page correctly', () => {
    render(<AboutPage />);
    
    expect(screen.getByText('VoxChain')).toBeInTheDocument();
    expect(screen.getByText('WHAT IT DOES')).toBeInTheDocument();
    expect(screen.getByText('Colosseum Frontier Hackathon 2026')).toBeInTheDocument();
    
    // Check if the "Launch Dashboard →" link is present
    expect(screen.getByText('Launch Dashboard →')).toBeInTheDocument();
  });
});
