const KEY = "mp_guest_favorites";

export function getGuestFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addGuestFavorite(id: string) {
  const items = getGuestFavorites();
  if (!items.includes(id)) {
    localStorage.setItem(KEY, JSON.stringify([...items, id]));
  }
}

export function removeGuestFavorite(id: string) {
  const items = getGuestFavorites().filter(x => x !== id);
  localStorage.setItem(KEY, JSON.stringify(items));
}

export function isGuestFavorite(id: string) {
  return getGuestFavorites().includes(id);
}
