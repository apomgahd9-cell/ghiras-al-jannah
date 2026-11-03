const FAVORITES_KEY = 'ghiras-favorites';

export function loadFavorites(): string[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveFavorites(ids: string[]): void {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
  } catch {
    // storage may be unavailable
  }
}

export function toggleFavorite(id: string): string[] {
  const current = loadFavorites();
  if (current.includes(id)) {
    const updated = current.filter((favId) => favId !== id);
    saveFavorites(updated);
    return updated;
  }
  const updated = [...current, id];
  saveFavorites(updated);
  return updated;
}

export function isFavorite(id: string): boolean {
  return loadFavorites().includes(id);
}
