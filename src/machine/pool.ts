import R from 'ramda';
import Register from './register';
import Value from './value';

type Key = Register;
type T = { readonly [key in Key]: Value };

type Pool = T;
const Pool = {
  create: (): T => ({
    ...Object.create(null),
    ...R.zipObj(Register.names, Register.names.map(() => 0)),
  }),
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
export default Pool;
