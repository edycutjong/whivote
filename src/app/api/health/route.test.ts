import { describe, it, expect } from 'vitest';
import { GET } from './route';

describe('Health API Route', () => {
  it('should return 200 OK and health status', async () => {
    const response = await GET();
    const data = await response.json();
    
    expect(response.status).toBe(200);
    expect(data.status).toBe('ok');
    expect(data.timestamp).toBeDefined();
    expect(data.uptime).toBeTypeOf('number');
    // environment could be undefined or a string
    if (data.environment !== undefined) {
      expect(typeof data.environment).toBe('string');
    }
  });
});
