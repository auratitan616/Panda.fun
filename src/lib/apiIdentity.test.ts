import { describe, expect, it } from 'vitest';
import { pickCanonicalMediaId } from './api';

describe('canonical media identity selection', () => {
  it('selects the exact TMDB TV match and ignores legacy-provider matches', () => {
    expect(pickCanonicalMediaId(
      [{ id: 'tmdb_tv_100088', type: 'tv', title: 'The Last of Us' }],
      [{ id: 'kinoma_tvmaze_44776', title: 'The Last of Us' }],
      'the-last-of-us',
      'series'
    )).toBe('tmdb_tv_100088');
  });
});
