import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadFavorites,
  saveFavorites,
  toggleFavorite,
  isFavorite,
} from '@/services/favoritesStorage';

describe('Favorites storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loadFavorites returns empty array by default', () => {
    expect(loadFavorites()).toEqual([]);
  });

  it('saveFavorites and loadFavorites round-trip', () => {
    saveFavorites(['id-1', 'id-2']);
    expect(loadFavorites()).toEqual(['id-1', 'id-2']);
  });

  it('toggleFavorite adds a new id', () => {
    const result = toggleFavorite('new-id');
    expect(result).toContain('new-id');
    expect(isFavorite('new-id')).toBe(true);
  });

  it('toggleFavorite removes an existing id', () => {
    toggleFavorite('remove-me');
    const result = toggleFavorite('remove-me');
    expect(result).not.toContain('remove-me');
    expect(isFavorite('remove-me')).toBe(false);
  });

  it('isFavorite returns false for non-favorited id', () => {
    expect(isFavorite('not-favorited')).toBe(false);
  });

  it('saveFavorites handles empty array', () => {
    saveFavorites([]);
    expect(loadFavorites()).toEqual([]);
  });

  it('loadFavorites handles corrupted data gracefully', () => {
    localStorage.setItem('ghiras-favorites', 'not valid json');
    expect(loadFavorites()).toEqual([]);
  });

  it('loadFavorites handles non-array data gracefully', () => {
    localStorage.setItem('ghiras-favorites', '"not an array"');
    expect(loadFavorites()).toEqual([]);
  });
});
