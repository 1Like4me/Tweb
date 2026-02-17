export function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as unknown;
    return parsed as T;
  } catch (error) {
    console.error('Failed to read from localStorage', key, error);
    return fallback;
  }
}

export function writeJson<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to write to localStorage', key, error);
  }
}

