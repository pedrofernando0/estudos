import { vi } from 'vitest';

// Provide localStorage for Node.js 22+ which requires --localstorage-file flag
const store = new Map();

globalThis.localStorage = {
  getItem: vi.fn(key => store.get(key) ?? null),
  setItem: vi.fn((key, value) => { store.set(key, value); }),
  removeItem: vi.fn(key => { store.delete(key); }),
  clear: vi.fn(() => { store.clear(); }),
  get length() { return store.size; },
  key: vi.fn(index => Array.from(store.keys())[index] ?? null)
};
