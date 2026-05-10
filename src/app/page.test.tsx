import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import WhivoteDashboard from './page';
import { magicBlockService } from '@/lib/magicblock';

// Mock the magicBlockService
vi.mock('@/lib/magicblock', () => ({
  magicBlockService: {
    activateSessionKey: vi.fn(),
    submitEncryptedVote: vi.fn(),
    revealResults: vi.fn().mockResolvedValue({
      opt_1: 85,
      opt_2: 32,
      opt_3: 8
    })
  }
}));

// Mock the components
vi.mock('@/components/StatusBar', () => ({
  StatusBar: () => <div data-testid="mock-status-bar">Status Bar</div>
}));

vi.mock('@/components/Footer', () => ({
  Footer: () => <div data-testid="mock-footer">Footer</div>
}));

describe('WhivoteDashboard (Main Page)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render the landing view initially', () => {
    render(<WhivoteDashboard />);
    expect(screen.getByText(/Private DAO Voting/i)).toBeInTheDocument();
    expect(screen.getByText('Launch App')).toBeInTheDocument();
  });

  it('should navigate to polls view when Launch App is clicked', () => {
    render(<WhivoteDashboard />);
    fireEvent.click(screen.getByText('Launch App'));
    expect(screen.getByText(/Proposal 42/i)).toBeInTheDocument();
  });

  it('should toggle session key on button click', async () => {
    render(<WhivoteDashboard />);
    const activateBtn = screen.getByText('ACTIVATE SESSION KEY');
    
    await act(async () => {
      fireEvent.click(activateBtn);
    });

    expect(magicBlockService.activateSessionKey).toHaveBeenCalled();
    expect(screen.getByText('SESSION KEY ACTIVE')).toBeInTheDocument();
  });

  it('should allow voting after activating session key', async () => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
    render(<WhivoteDashboard />);
    
    // Go to polls
    fireEvent.click(screen.getByText('Launch App'));
    
    const voteBtn = screen.getByText('Yes, increase 5%');
    
    // Attempt vote without session key
    fireEvent.click(voteBtn);
    expect(window.alert).toHaveBeenCalledWith("Please activate Session Key first for 1-click voting.");
    expect(magicBlockService.submitEncryptedVote).not.toHaveBeenCalled();

    // Activate session key
    const activateBtn = screen.getByText('ACTIVATE SESSION KEY');
    await act(async () => {
      fireEvent.click(activateBtn);
    });
    expect(screen.getByText('SESSION KEY ACTIVE')).toBeInTheDocument();

    // Deactivate session key
    await act(async () => {
      fireEvent.click(screen.getByText('SESSION KEY ACTIVE'));
    });
    expect(screen.getByText('ACTIVATE SESSION KEY')).toBeInTheDocument();

    // Reactivate session key
    await act(async () => {
      fireEvent.click(screen.getByText('ACTIVATE SESSION KEY'));
    });

    // Attempt vote with session key
    await act(async () => {
      fireEvent.click(voteBtn);
    });

    expect(magicBlockService.submitEncryptedVote).toHaveBeenCalled();
    expect(screen.getByText(/Vote encrypted & submitted/i)).toBeInTheDocument();
  });

  it('should navigate to create poll view and back', () => {
    render(<WhivoteDashboard />);
    
    // Go to create poll
    fireEvent.click(screen.getByText('Create Poll'));
    expect(screen.getByText('Create Private Poll')).toBeInTheDocument();
    
    // Go back to polls
    fireEvent.click(screen.getByText('Back to Polls'));
    expect(screen.getByText(/Proposal 42/i)).toBeInTheDocument();
    
    // Go to create poll again
    fireEvent.click(screen.getByText('Create Poll'));
    
    // Launch to ephemeral rollup
    fireEvent.click(screen.getByText('Launch to Ephemeral Rollup'));
    expect(screen.getByText(/Proposal 42/i)).toBeInTheDocument();
  });

  it('should reveal results when timer ends', async () => {
    render(<WhivoteDashboard />);
    
    // Go to polls
    fireEvent.click(screen.getByText('Launch App'));
    
    // Fast-forward 30 seconds
    await act(async () => {
      vi.advanceTimersByTime(30000);
    });
    vi.useRealTimers();

    // Should call revealResults and update view
    expect(magicBlockService.revealResults).toHaveBeenCalled();
    
    await act(async () => {
      await Promise.resolve();
    });
    
    expect(screen.getByText('RESULTS REVEALED')).toBeInTheDocument();
  });
});
