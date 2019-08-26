import R from 'ramda';
import Value from './value';
import Instruction, { Opcode } from './instruction';
import Scope from './scope';
import Pool from './pool';
import State from './state';
import { encode } from './serializer';

// use a generator
const execute = (t: State, op: Instruction): State => {
  const next = (t: State) => {
    const index = t.index + 1;
    const op = t.instructions[index];
    return op ? execute({ ...t, index }, op) : t;
  };
  const acc = (acc: Value): State => next({ ...t, acc });
  const pool = (pool: Pool): State => next({ ...t, pool });
  const scope = (scope: Scope): State => next({ ...t, scope });

  if (op.opcode === Opcode.LdaScope) {
    return acc(Scope.get(t.scope, op.id));
  }
  if (op.opcode === Opcode.StaScope) {
    return scope(Scope.set(t.scope, op.id, t.acc));
  }
  if (op.opcode === Opcode.Lda) {
    return acc(Pool.get(t.pool, op.source));
  }
  if (op.opcode === Opcode.Sta) {
    return pool(Pool.set(t.pool, op.destination, t.acc));
  }
  if (op.opcode === Opcode.CreateNumber) {
    return acc(op.number);
  }
  if (op.opcode === Opcode.CreateClosure) {
    if (Value.isNumber(t.acc)) {
      const start = t.index + 1;
      const end = t.index + t.acc;
      return next({ ...t, index: end, acc: { start, end } });
    }
    throw new Error(`${t.acc} isn't a number`);
  }
  if (op.opcode === Opcode.Mov) {
    return pool(Pool.set(t.pool, op.destination, Pool.get(t.pool, op.source)));
  }
  if (op.opcode === Opcode.Call) {
    if (Value.isFunction(t.acc)) {
      const instructions = t.instructions.slice(t.acc.start, t.acc.end + 1);
      let internalT = {
        ...t,
        index: t.acc.start,
        stack: [...t.stack, t.index],
      };
      for (const op of instructions) {
        if (op.opcode === Opcode.Return) {
          break;
        }
        internalT = execute(internalT, op);
      }
      return next({ ...internalT, index: t.index, stack: t.stack });
    }
    if (Value.isNative(t.acc)) {
      return next(t.acc(t));
    }
    throw new Error(`${t.acc} isn't a function`);
  }
  if (op.opcode === Opcode.Return) {
    const index = R.last(t.stack);
    const stack = t.stack.slice(0, -1);
    return next({ ...t, index, stack });
  }
  throw new Error(`error at opcode ${encode(op)}`);
};
const evaluate = (scope: Scope, instructions: Instruction[]): State =>
  execute(
    {
      acc: 0,
      pool: Pool.create(),
      scope,
      stack: [],
      index: 0,
      instructions,
    },
    instructions[0]
  );
export default evaluate;
