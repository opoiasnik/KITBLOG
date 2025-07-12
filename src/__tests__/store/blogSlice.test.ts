import { configureStore } from '@reduxjs/toolkit';
import blogSlice, { setFilter, clearFilter } from '@/store/blogSlice';

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  doc: jest.fn(),
  addDoc: jest.fn(),
  getDocs: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  orderBy: jest.fn(),
  Timestamp: {
    now: jest.fn(() => ({ toDate: () => new Date('2023-01-01') })),
  },
}));

jest.mock('@/lib/firebase', () => ({
  db: {},
}));

const createTestStore = () => {
  return configureStore({
    reducer: {
      blog: blogSlice,
    },
  });
};

describe('blogSlice', () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore();
  });

  describe('initial state', () => {
    test('should have correct initial state', () => {
      const state = store.getState().blog;
      expect(state.posts).toEqual([]);
      expect(state.comments).toEqual([]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.currentPost).toBe(undefined);
      expect(state.filter).toEqual({});
    });
  });

  describe('setFilter action', () => {
    test('should set filter correctly', () => {
      const filterOptions = {
        tags: ['javascript', 'react'],
        author: 'testuser',
        isPublished: true,
        searchTerm: 'test search',
      };

      store.dispatch(setFilter(filterOptions));

      const state = store.getState().blog;
      expect(state.filter).toEqual(filterOptions);
    });

    test('should update existing filter', () => {
      store.dispatch(setFilter({ tags: ['javascript'] }));
      
      store.dispatch(setFilter({ author: 'testuser' }));

      const state = store.getState().blog;
      expect(state.filter).toEqual({ author: 'testuser' });
    });
  });

  describe('clearFilter action', () => {
    test('should clear all filters', () => {
      store.dispatch(setFilter({
        tags: ['javascript', 'react'],
        author: 'testuser',
        isPublished: true,
        searchTerm: 'test search',
      }));

      store.dispatch(clearFilter());

      const state = store.getState().blog;
      expect(state.filter).toEqual({});
    });
  });

  describe('async thunks', () => {
    test('should handle pending state for async actions', () => {
      const initialState = store.getState().blog;
      expect(initialState.loading).toBe(false);
      expect(initialState.error).toBe(null);
    });
  });

  describe('reducer edge cases', () => {
    test('should handle undefined filter values', () => {
      store.dispatch(setFilter({
        tags: undefined,
        author: undefined,
        isPublished: undefined,
        searchTerm: undefined,
      }));

      const state = store.getState().blog;
      expect(state.filter.tags).toBe(undefined);
      expect(state.filter.author).toBe(undefined);
      expect(state.filter.isPublished).toBe(undefined);
      expect(state.filter.searchTerm).toBe(undefined);
    });

    test('should handle empty arrays in filter', () => {
      store.dispatch(setFilter({
        tags: [],
      }));

      const state = store.getState().blog;
      expect(state.filter.tags).toEqual([]);
    });

    test('should handle empty strings in filter', () => {
      store.dispatch(setFilter({
        author: '',
        searchTerm: '',
      }));

      const state = store.getState().blog;
      expect(state.filter.author).toBe('');
      expect(state.filter.searchTerm).toBe('');
    });
  });
});
