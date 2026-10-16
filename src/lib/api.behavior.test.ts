import { describe, expect, it, vi } from 'vitest';

describe('TMDB-only metadata identity', () => {
  it('does not request TVMaze when given a legacy TVMaze media ID', async () => {
    const previousWindow = (globalThis as any).window;
    const previousFetch = globalThis.fetch;
    (globalThis as any).window = {
      location: { origin: 'http://localhost' },
      setTimeout,
      clearTimeout,
      dispatchEvent: () => true,
    };
    const fetchMock = vi.fn();
    globalThis.fetch = fetchMock as typeof fetch;
    try {
      const { api } = await import('./api');
      const result = await api.getRecommendations('kinoma_tvmaze_44776');
      expect(result.results).toEqual([]);
      expect(fetchMock).not.toHaveBeenCalled();
    } finally {
      globalThis.fetch = previousFetch;
      (globalThis as any).window = previousWindow;
    }
  });
});
