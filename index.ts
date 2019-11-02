import { createSlice, CaseReducers } from 'redux-starter-kit';

interface Act<S = any> {
  type: string;
  payload: S;
}

type NoInfer<T> = [T][T extends any ? 0 : never];

interface SliceHelperOptions<State = any> {
  name: string;
  initialState?: State;
  extraReducers?: CaseReducers<NoInfer<State>, any>;
}

interface SliceHelperReqOptions<State = any> {
  name: string;
  initialState: State;
  extraReducers?: CaseReducers<NoInfer<State>, any>;
}

export const mapSlice = <State extends { [key: string]: any }>({
  name,
  initialState = {} as State,
  extraReducers,
}: SliceHelperOptions<State>) =>
  createSlice({
    name,
    initialState,
    extraReducers,
    reducers: {
      add: (state: State, action: Act<State>) => {
        const newState = { ...state };
        const { payload } = action;
        Object.keys(payload).forEach((key) => {
          newState[key as keyof State] = payload[key];
        });
        return newState;
      },
      set: (state: State, action: Act<State>): State => action.payload,
      remove: (state: State, action: Act<string[]>): State => {
        const newState = { ...state };
        const { payload } = action;
        payload.forEach((key) => {
          delete newState[key];
        });
        return newState;
      },
      reset: (state: State) => initialState,
      patch: (
        state: State,
        action: Act<{ [key: string]: Partial<State[keyof State]> }>,
      ): State => {
        const newState = { ...state };
        const { payload } = action;
        Object.keys(payload).forEach((id) => {
          if (typeof payload[id] !== 'object') {
            return;
          }

          Object.keys(payload[id]).forEach((key) => {
            // getting weird issue with typing here
            const s: any = newState;
            if (s.hasOwnProperty(id)) {
              s[id] = { ...s[id], [key]: (payload[id] as any)[key] };
            }
          });
        });

        return newState;
      },
    },
  });

export const assignSlice = <State extends any = any>({
  name,
  initialState,
  extraReducers,
}: SliceHelperReqOptions<State>) =>
  createSlice({
    name,
    initialState,
    extraReducers,
    reducers: {
      set: (state: State, action: Act<State>) => action.payload,
      reset: (state: State) => initialState,
    },
  });

interface LoadingItemState {
  error: string;
  loading: boolean;
  success: boolean;
  message: string;
}

const defaultLoadingItem = (): LoadingItemState => ({
  error: '',
  message: '',
  loading: false,
  success: false,
});

export const loadingSlice = ({
  name,
  initialState = defaultLoadingItem(),
  extraReducers,
}: SliceHelperOptions<LoadingItemState>) =>
  createSlice({
    name,
    initialState,
    extraReducers,
    reducers: {
      success: (state: LoadingItemState, action: Act<string | undefined>) => ({
        error: '',
        message: action.payload || '',
        loading: false,
        success: true,
      }),
      error: (state: LoadingItemState, action: Act<string | undefined>) => ({
        error: action.payload || '',
        message: '',
        loading: false,
        success: false,
      }),
      loading: (state: LoadingItemState, action: Act<string | undefined>) => ({
        error: '',
        message: action.payload || '',
        loading: true,
        success: false,
      }),
      reset: (state: LoadingItemState) => initialState,
    },
  });
