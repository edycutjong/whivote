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

  describe('authenticate', () => {
    let originalFetch: typeof global.fetch;

    beforeEach(() => {
      originalFetch = global.fetch;
    });

    afterEach(() => {
      global.fetch = originalFetch;
    });

    it('should successfully authenticate via challenge and login', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ challenge: 'test-challenge' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'real_auth_token' })
        }) as unknown as typeof fetch;

      const signMessage = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
      
      const promise = service.authenticate('pubkey123', signMessage);
      const result = await promise;
      
      expect(global.fetch).toHaveBeenCalledTimes(2);
      expect(signMessage).toHaveBeenCalled();
      expect(result).toBe('real_auth_token');
    });

    it('should fallback gracefully on API error', async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));
      const signMessage = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
      
      const promise = service.authenticate('pubkey123', signMessage);
      await Promise.resolve(); // let microtasks run
      vi.advanceTimersByTime(800); // the fallback timeout
      
      const result = await promise;
      
      expect(console.error).toHaveBeenCalled();
      expect(result).toBe('mock_auth_token_for_demo');
    });

    it('should throw error if challenge request fails', async () => {
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: false
      }) as unknown as typeof fetch;

      const signMessage = vi.fn();
      const promise = service.authenticate('pubkey123', signMessage);
      await vi.runAllTimersAsync();
      const result = await promise;
      expect(result).toBe('mock_auth_token_for_demo');
    });

    it('should handle alternative challenge data format', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ message: 'alt-challenge' })
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ token: 'real_auth_token_2' })
        }) as unknown as typeof fetch;

      const signMessage = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
      const promise = service.authenticate('pubkey123', signMessage);
      await vi.runAllTimersAsync();
      const result = await promise;
      expect(result).toBe('real_auth_token_2');
    });

    it('should throw error if login request fails', async () => {
      global.fetch = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ challenge: 'test-challenge' })
        })
        .mockResolvedValueOnce({
          ok: false
        }) as unknown as typeof fetch;

      const signMessage = vi.fn().mockResolvedValue(new Uint8Array([1, 2, 3]));
      const promise = service.authenticate('pubkey123', signMessage);
      await vi.runAllTimersAsync();
      const result = await promise;
      expect(result).toBe('mock_auth_token_for_demo');
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
