import { useEffect, useState } from 'react';

const useLocalStorage = (key, fallbackValue) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') {
      return typeof fallbackValue === 'function' ? fallbackValue() : fallbackValue;
    }
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) {
        return JSON.parse(stored);
      }
      return typeof fallbackValue === 'function' ? fallbackValue() : fallbackValue;
    } catch (error) {
      return typeof fallbackValue === 'function' ? fallbackValue() : fallbackValue;
    }
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      // Silently ignore localStorage quota errors
    }
  }, [key, value]);

  return [value, setValue];
};

export default useLocalStorage;
