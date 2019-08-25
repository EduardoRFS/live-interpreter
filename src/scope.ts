import Value from './value';

type Key = string;
type T = { readonly [key in Key]: Value };

declare type Scope = T;
const Scope = {
  create: (): T => Object.create(null),
  get: (t: T, key: Key): Value => {
    const value = t[key];
    if (value === undefined) {
      throw new Error(`key: "${key}" not found`);
    }
    return value;
  },
  set: (t: T, key: Key, value: Value): T => ({ ...t, [key]: value }),
  fromNative: (t: T): T => t,
  toNative: (t: T): T => t,
};
export default Scope;
