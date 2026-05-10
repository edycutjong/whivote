import { describe, it, expect, vi, beforeEach, afterEach, Mock } from 'vitest';
import { MagicBlockService } from './magicblock';
import { Connection, PublicKey } from '@solana/web3.js';
import { createDelegateInstruction } from '@magicblock-labs/ephemeral-rollups-sdk';

vi.mock('@solana/web3.js', () => {
  const MockConnection = vi.fn(function() {
    return { getLatestBlockhash: vi.fn().mockResolvedValue({ blockhash: 'test-blockhash', lastValidBlockHeight: 100 }) };
  });
  
  const MockPublicKey = vi.fn(function(key: string) {
    return { toBase58: () => key };
  });

  const MockTransaction = vi.fn(function() {
    return { add: vi.fn().mockReturnThis() };
  });

  return {
    Connection: MockConnection,
    PublicKey: MockPublicKey,
    Transaction: MockTransaction
  };
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(PublicKey as any).findProgramAddressSync = vi.fn().mockReturnValue([{ toBase58: () => 'pda-key' }, 255]);

vi.mock('@magicblock-labs/ephemeral-rollups-sdk', () => {
  return {
    createDelegateInstruction: vi.fn().mockReturnValue('mock-instruction')
  };
});

describe('MagicBlockService', () => {
  let service: MagicBlockService;
  let originalEnv: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    originalEnv = process.env.NEXT_PUBLIC_RPC_URL;
    service = new MagicBlockService();
    
    vi.spyOn(console, 'log').mockImplementation(() => {});
    vi.spyOn(console, 'error').mockImplementation(() => {});
    
    vi.useFakeTimers();
  });

  afterEach(() => {
    if (originalEnv) {
      process.env.NEXT_PUBLIC_RPC_URL = originalEnv;
    } else {
      delete process.env.NEXT_PUBLIC_RPC_URL;
    }
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('constructor', () => {
    it('should use default RPC URL if env var is not set', () => {
      delete process.env.NEXT_PUBLIC_RPC_URL;
      new MagicBlockService();
      expect(Connection).toHaveBeenCalledWith('https://api.devnet.solana.com');
    });

    it('should use env var RPC URL if set', () => {
      process.env.NEXT_PUBLIC_RPC_URL = 'https://custom-rpc.com';
      new MagicBlockService();
      expect(Connection).toHaveBeenCalledWith('https://custom-rpc.com');
    });
  });

  describe('init', () => {
    it('should initialize and prevent duplicate initialization', () => {
      service.init();
      service.init(); // 2nd time should return early
      expect(service['initialized']).toBe(true);
    });
  });

  describe('activateSessionKey', () => {
    it('should activate session key and resolve after timeout', async () => {
      const promise = service.activateSessionKey('wallet123');
      vi.advanceTimersByTime(500);
      const result = await promise;
      expect(result).toBe('session_active_mock_token');
      expect(console.log).toHaveBeenCalledWith('[MagicBlock SDK] Activating session key for wallet123');
      expect(service['initialized']).toBe(true);
    });
  });

  describe('submitEncryptedVote', () => {
    it('should successfully submit vote', async () => {
      const promise = service.submitEncryptedVote('poll_1', 'payload', 'voter123');
      const result = await promise;
      
      expect(PublicKey).toHaveBeenCalledWith('voter123');
      expect(PublicKey.findProgramAddressSync).toHaveBeenCalled();
      expect(createDelegateInstruction).toHaveBeenCalled();
      
      expect(result.success).toBe(true);
      expect(result.txId).toMatch(/^MgcBLK_/);
      expect(console.log).toHaveBeenCalledWith('[MagicBlock SDK] Built delegate transaction for signing');
    });

    it('should fallback gracefully on delegate error', async () => {
      const error = new Error('Test error');
      (createDelegateInstruction as Mock).mockImplementationOnce(() => {
        throw error;
      });
      
      const promise = service.submitEncryptedVote('poll_1', 'payload', 'voter123');
      await Promise.resolve(); // let microtasks run
      await Promise.resolve(); 
      vi.advanceTimersByTime(800); // the fallback timeout
      
      const result = await promise;
      
      expect(console.error).toHaveBeenCalledWith('[MagicBlock SDK] Delegate instruction failed:', error);
      expect(result.success).toBe(true);
      expect(result.txId).toMatch(/^MgcBLK_/);
    });
  });

  describe('revealResults', () => {
    it('should successfully reveal results', async () => {
      const promise = service.revealResults('poll_1', 'auth123');
      
      await Promise.resolve(); // Microtasks for the getLatestBlockhash 
      vi.advanceTimersByTime(1200); // the simulation timeout
      
      const result = await promise;
      
      expect(PublicKey).toHaveBeenCalledWith('auth123');
      expect(createDelegateInstruction).toHaveBeenCalled();
      expect(console.log).toHaveBeenCalledWith('[MagicBlock SDK] Built undelegate transaction for signing');
      
      expect(result).toEqual({
        "opt_1": 84,
        "opt_2": 32,
        "opt_3": 8
      });
    });

    it('should handle undelegate failure and still return results', async () => {
      const error = new Error('Undelegate error');
      (createDelegateInstruction as Mock).mockImplementationOnce(() => {
        throw error;
      });
      
      const promise = service.revealResults('poll_1', 'auth123');
      
      await Promise.resolve();
      vi.advanceTimersByTime(1200);
      
      const result = await promise;
      
      expect(console.error).toHaveBeenCalledWith('[MagicBlock SDK] Undelegate instruction failed:', error);
      expect(result).toEqual({
        "opt_1": 84,
        "opt_2": 32,
        "opt_3": 8
      });
    });
  });
});
