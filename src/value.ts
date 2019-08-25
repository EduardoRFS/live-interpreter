// eslint-disable-next-line @typescript-eslint/no-namespace
namespace internal {
  export type Function = (...values: Value[]) => Value;
  export type Boolean = boolean;
  export type String = string;
  export type Number = number;
}

declare type Value =
  | internal.Function
  | internal.Boolean
  | internal.String
  | internal.Number;
const Value = {
  isFunction: (value: Value): value is internal.Function =>
    typeof value === 'function',
  isBoolean: (value: Value): value is internal.Boolean =>
    typeof value === 'boolean',
  isString: (value: Value): value is internal.String =>
    typeof value === 'boolean',
  isNumber: (value: Value): value is internal.Number =>
    typeof value === 'boolean',

  fromNative: (value: Value): Value => value,
  toNative: (value: Value): Value => value,
};
export default Value;
