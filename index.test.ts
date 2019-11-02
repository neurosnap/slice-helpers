import { mapSlice, assignSlice, loadingSlice } from './index';
import freeze from 'deep-freeze-strict';

interface State {
  [key: string]: string;
}

describe('mapSlice', () => {
  describe('add', () => {
    it('should add items to map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State>({ name });
      const test = {
        1: 'one',
        2: 'two',
      };
      const state = freeze({ 3: 'three' });
      const actual = reducer(state, actions.add(test));
      expect(actual).toEqual({ ...state, ...test });
    });
  });

  describe('set', () => {
    it('should set items to map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State>({ name });
      const test = {
        1: 'one',
        2: 'two',
      };
      const state = freeze({ 3: 'three' });
      const actual = reducer(state, actions.set(test));
      expect(actual).toEqual(test);
    });
  });

  describe('remove', () => {
    it('should remove items from map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State>({ name });
      const state = freeze({ 1: 'one', 2: 'two', 3: 'three' });
      const actual = reducer(state, actions.remove(['1', '2']));
      expect(actual).toEqual({ 3: 'three' });
    });
  });

  describe('reset', () => {
    it('should reset map', () => {
      const name = 'test';
      const { reducer, actions } = mapSlice<State>({ name });
      const state = freeze({ 1: 'one', 2: 'two', 3: 'three' });
      const actual = reducer(state, actions.reset());
      expect(actual).toEqual({});
    });
  });

  describe('patch', () => {
    describe('when entity is an object', () => {
      it('should update a prop', () => {
        interface State {
          [key: string]: { name: string };
        }

        const name = 'test';
        const { reducer, actions } = mapSlice<State>({
          name,
        });
        const state = freeze({
          1: { name: 'one' },
          2: { name: 'two' },
          3: { name: 'three' },
        });
        const actual = reducer(state, actions.patch({ 2: { name: 'four' } }));
        expect(actual).toEqual({
          1: { name: 'one' },
          2: { name: 'four' },
          3: { name: 'three' },
        });
      });
    });
  });

  describe('when entity is *not* an object', () => {
    it('should update a prop', () => {
      interface State {
        [key: string]: string;
      }

      const name = 'test';
      const { reducer, actions } = mapSlice<State>({
        name,
      });
      const state = freeze({
        1: 'one',
        2: 'two',
        3: 'three',
      });
      const actual = reducer(state, actions.patch({ 2: 'cool' }));
      expect(actual).toEqual({ '1': 'one', '2': 'two', '3': 'three' });
    });
  });
});

describe('assignSlice', () => {
  describe('set', () => {
    it('should set state to payload', () => {
      const name = 'test';
      const { reducer, actions } = assignSlice<number>({
        name,
        initialState: 0,
      });
      const actual = reducer(0, actions.set(2));
      expect(actual).toEqual(2);
    });
  });

  describe('reset', () => {
    it('should reset to initialState', () => {
      const name = 'test';
      const { reducer, actions } = assignSlice({ name, initialState: 5 });
      const actual = reducer(0, actions.reset());
      expect(actual).toEqual(5);
    });
  });
});

describe('loadingSlice', () => {
  describe('loading', () => {
    it('should set the state to loading', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: false,
        success: false,
      });
      const actual = reducer(state, actions.loading());

      expect(actual).toEqual({
        loading: true,
        error: '',
        message: '',
        success: false,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: false,
        success: false,
      });
      const actual = reducer(state, actions.loading('hi there'));

      expect(actual).toEqual({
        loading: true,
        error: '',
        message: 'hi there',
        success: false,
      });
    });
  });

  describe('success', () => {
    it('should set the state to loading', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: true,
        success: false,
      });
      const actual = reducer(state, actions.success());

      expect(actual).toEqual({
        loading: false,
        error: '',
        message: '',
        success: true,
      });
    });

    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: '',
        loading: true,
        success: false,
      });
      const actual = reducer(state, actions.success('wow'));

      expect(actual).toEqual({
        loading: false,
        error: '',
        message: 'wow',
        success: true,
      });
    });
  });

  describe('error', () => {
    it('should set the state to loading with a message', () => {
      const name = 'loading';
      const { reducer, actions } = loadingSlice({ name });
      const state = freeze({
        error: '',
        message: 'cool',
        loading: true,
        success: false,
      });
      const actual = reducer(state, actions.error('some error'));

      expect(actual).toEqual({
        loading: false,
        message: '',
        error: 'some error',
        success: false,
      });
    });
  });
});
