// Set an item in localStorage, with JSON serialization
export const setLocalStorageItem = (key: string, value: any): void => {
  if (typeof window !== "undefined") {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }
};

// Get an item from localStorage, with JSON deserialization
export const getLocalStorageItem = (key: string): any | null => {
  if (typeof window !== "undefined") {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting localStorage key "${key}":`, error);
      return null;
    }
  }
  return null;
};
