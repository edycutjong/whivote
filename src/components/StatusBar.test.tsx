import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { StatusBar } from './StatusBar';

describe('StatusBar Component', () => {
  it('should render the status bar with correct statuses', () => {
    render(<StatusBar />);
    
    expect(screen.getByText('SYSTEM ONLINE')).toBeInTheDocument();
    expect(screen.getByText('v1.0.0')).toBeInTheDocument();
    
    // Using string matching for nested spans
    expect(screen.getByText((content, element) => content.includes('LATENCY:') && element?.textContent?.includes('12ms') || false)).toBeInTheDocument();
    expect(screen.getByText((content, element) => content.includes('UPTIME:') && element?.textContent?.includes('99.9%') || false)).toBeInTheDocument();
  });
});
