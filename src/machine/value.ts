import State from './state';

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace internal {
  export type Function = { start: number; end: number };
  export type Number = number;
  export type Native = (state: State) => State;
}

declare type Value = internal.Function | internal.Number | internal.Native;
const Value = {
  isFunction: (value: Value): value is internal.Function =>
    typeof value === 'object' && 'start' in value && 'end' in value,
  isNumber: (value: Value): value is internal.Number =>
    typeof value === 'number',
  isNative: (value: Value): value is internal.Native =>
    typeof value === 'function',
};
export default Value;
