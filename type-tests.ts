import { mapSlice, assignSlice, loadingSlice } from './index';

interface Test {
  [key: string]: { id: string };
}

const test = mapSlice<Test>({ name: 'test', extraReducers: {} });
// $ExpectType Slice<Test, { add: (state: Test, action: Act<Test>) => Test; set: (state: Test, action: Act<Test>) => Test; remove: (state: Test, action: Act<string[]>) => Test; reset: (state: Test) => Test; patch: (state: Test, action: Act<...>) => Test; }>
test;

const {
  set: setTest,
  add: addTest,
  remove: removeTest,
  patch: patchTest,
} = test.actions;

test.actions.add({ 1: { id: 'ad' } });
test.actions.set({ 1: { id: 'hi' } });
test.actions.remove(['1']);
test.actions.patch({ 1: { id: 'ad' } });
// $ExpectType WithTypeProperty<string, <PT extends Test>(payload: PT) => WithPayload<PT, Action<string>>>
addTest;
// $ExpectType WithTypeProperty<string, <PT extends Test>(payload: PT) => WithPayload<PT, Action<string>>>
setTest;
// $ExpectType WithTypeProperty<string, <PT extends string[]>(payload: PT) => WithPayload<PT, Action<string>>>
removeTest;
// $ExpectType WithTypeProperty<string, <PT extends { [key: string]: Partial<{ id: string; }>; }>(payload: PT) => WithPayload<PT, Action<string>>>
patchTest;

const assign = assignSlice<boolean>({ name: 'ok', initialState: false });
const { set: setAssign, reset: resetAssign } = assign.actions;
assign.actions.set(true);
assign.actions.reset();
// $ExpectType WithTypeProperty<string, <PT extends boolean>(payload: PT) => WithPayload<PT, Action<string>>>
setAssign;
resetAssign;

const loading = loadingSlice({ name: 'loading' });
loading.actions.loading('123');
loading.actions.success('yay');
loading.actions.error('uh oh');
