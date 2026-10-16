import { describe, expect, it } from 'vitest';
import {
  buildMediaImageCandidates,
  normalizeMediaImageUrl,
  optimizeImageUrl,
} from './mediaImages';

describe('media image URL normalization', () => {
  it('normalizes HTTP provider URLs to HTTPS without altering their path', () => {
    expect(normalizeMediaImageUrl('http://static.tvmaze.com/uploads/images/medium_portrait/show.jpg'))
      .toBe('https://static.tvmaze.com/uploads/images/medium_portrait/show.jpg');
  });

  it('constructs a TMDB URL for a raw poster path', () => {
    expect(normalizeMediaImageUrl('/abc123.jpg', 'tmdb'))
      .toBe('https://image.tmdb.org/t/p/original/abc123.jpg');
  });

  it('constructs a TVMaze URL for a known relative upload path', () => {
    expect(normalizeMediaImageUrl('/uploads/images/original_untouched/1/2/show.jpg'))
      .toBe('https://static.tvmaze.com/uploads/images/original_untouched/1/2/show.jpg');
  });

  it('preserves same-origin frontend paths while rejecting ambiguous relative paths and malformed URLs', () => {
    expect(normalizeMediaImageUrl('/assets/poster.webp', 'tmdb')).toBe('/assets/poster.webp');
    expect(normalizeMediaImageUrl('/api/media/poster?id=123', 'tmdb')).toBe('/api/media/poster?id=123');
    expect(normalizeMediaImageUrl('posters/show.jpg')).toBeNull();
    expect(normalizeMediaImageUrl('https://[')).toBeNull();
    expect(normalizeMediaImageUrl('javascript:alert(1)')).toBeNull();
  });

  it('optimizes only TMDB image paths and preserves other provider URLs', () => {
    expect(optimizeImageUrl('https://image.tmdb.org/t/p/original/poster.jpg', 'w342'))
      .toBe('https://image.tmdb.org/t/p/w342/poster.jpg');
    expect(optimizeImageUrl('https://static.tvmaze.com/uploads/images/original_untouched/show.jpg', 'w342'))
      .toBe('https://static.tvmaze.com/uploads/images/original_untouched/show.jpg');
  });

  it('tries bounded TMDB sizes before fallback and deduplicates candidates', () => {
    const candidates = buildMediaImageCandidates(
      'https://image.tmdb.org/t/p/w500/poster.jpg',
      'https://static.tvmaze.com/uploads/images/original_untouched/fallback.jpg',
      'w342'
    );
    expect(candidates.slice(0, 3)).toEqual([
      'https://image.tmdb.org/t/p/w342/poster.jpg',
      'https://image.tmdb.org/t/p/w500/poster.jpg',
      'https://image.tmdb.org/t/p/original/poster.jpg',
    ]);
    expect(candidates[3]).toBe('https://static.tvmaze.com/uploads/images/original_untouched/fallback.jpg');
    expect(candidates[candidates.length - 1]).toMatch(/^data:image\/svg\+xml/);
    expect(new Set(candidates).size).toBe(candidates.length);
  });

  it('uses a graceful local fallback when primary artwork is missing', () => {
    const candidates = buildMediaImageCandidates('', null);
    expect(candidates).toHaveLength(1);
    expect(candidates[0]).toMatch(/^data:image\/svg\+xml/);
  });
});
