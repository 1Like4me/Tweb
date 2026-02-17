import { Dispatch, SetStateAction, useEffect, useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored != null) {
        return JSON.parse(stored) as T;
      }
    } catch (error) {
      console.error('Failed to parse localStorage value', key, error);
    }
    return initialValue;
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to store localStorage value', key, error);
    }
  }, [key, value]);

  return [value, setValue];
}

