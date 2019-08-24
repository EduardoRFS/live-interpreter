/* eslint-disable @typescript-eslint/ban-types */
import {
  parse,
  TSESTree,
  AST_NODE_TYPES as type,
} from '@typescript-eslint/typescript-estree';
import { Dictionary } from 'ts-essentials';
import R from 'ramda';

type Value = Object | boolean | string | number | null;
type Object = {
  internal: Dictionary<unknown>;
  descriptors: Dictionary<{
    configurable: boolean;
    enumerable: boolean;
    writable: boolean;
    value: Value;
  }>;
};
type Function = Object & {
  internal: {
    '[[Call]]': (args: Value[]) => Value;
  };
};
type Node = TSESTree.Node;
type Scope = Dictionary<Value>;
type T = {
  value: unknown;
  scope: Scope;
};

// const toString = (node: Node): string => {
//   const combine = (...parts: string[]) =>
//     parts.filter(x => typeof x === 'string').join(' ');
//   if (node.type === type.Identifier) {
//     return node.name;
//   }
//   if (node.type === type.Literal) {
//     return node.raw;
//   }
//   if (node.type === type.ArrowFunctionExpression) {
//     const params = node.params.map(toString).join(', ');
//     return combine(`(${params})`, '=>', toString(node.body));
//   }
//   throw new Error(`unknown node type ${node.type}`);
// };
const createFunction = (node: Node, run: (args: Value[]) => Value): Object => ({
  internal: {
    '[[Call]]': (args: Value[]) => run(args),
  },
  descriptors: {},
});
const isFunction = (value: Value): value is Function =>
  value !== null && typeof value === 'object' && !!value.internal['[[Call]]'];

const execute = (scope: Scope) => (node: Node): Value => {
  if (node.type === type.Identifier) {
    return scope[node.name];
  }
  if (node.type === type.Literal) {
    if (
      typeof node.value === 'string' ||
      typeof node.value === 'number' ||
      typeof node.value === 'boolean' ||
      node.value === null
    ) {
      return node.value;
    }
    throw new Error(`unknown literal type ${node.value}`);
  }
  if (node.type === type.VariableDeclaration) {
    node.declarations.forEach(execute(scope));
    return null;
  }
  if (node.type === type.VariableDeclarator) {
    if (node.init && node.id.type === type.Identifier) {
      // TODO: grr mutation
      // eslint-disable-next-line no-param-reassign
      scope[node.id.name] = execute(scope)(node.init) as Value;
      return null;
    }
    if (!node.init) {
      throw new Error(`node init shouldn't be null`);
    }
    throw new Error(`unknown declaration id type ${node.id.type}`);
  }
  if (node.type === type.ExpressionStatement) {
    return execute(scope)(node.expression);
  }
  if (node.type === type.ArrowFunctionExpression) {
    const keys = node.params.map(param => {
      if (param.type === type.Identifier) {
        return param.name;
      }
      throw new Error(`param type unknown ${node.type}`);
    });
    return createFunction(node, (values: Value[]) => {
      const internalScope = { ...scope, ...R.zipObj(keys, values) };
      return execute(internalScope)(node.body);
    });
  }
  if (node.type === type.BinaryExpression) {
    if (node.operator === '-') {
      const a = execute(scope)(node.left) as any;
      const b = execute(scope)(node.right) as any;
      return a - b;
    }
    if (node.operator === '==') {
      const a = execute(scope)(node.left) as any;
      const b = execute(scope)(node.right) as any;
      return a === b;
    }
    throw new Error(`unknown operator ${node.operator}`);
  }
  if (node.type === type.CallExpression) {
    const fn = execute(scope)(node.callee);
    const args = node.arguments.map(arg => execute(scope)(arg));
    if (isFunction(fn)) {
      return fn.internal['[[Call]]'](args);
    }
    throw new Error(`${JSON.stringify(node.callee)} isn't a function`);
  }
  if (node.type === type.ConditionalExpression) {
    return execute(scope)(node.test)
      ? execute(scope)(node.consequent)
      : execute(scope)(node.alternate);
  }
  if (node.type === type.Program || node.type === type.BlockStatement) {
    return R.last(node.body.map(execute(scope)));
  }
  throw new Error(`unknown node type ${node.type}`);
};
const evaluate = (source: string): T => {
  const getReturn = (value: Value) => {
    if (
      typeof value === 'string' ||
      typeof value === 'number' ||
      typeof value === 'boolean' ||
      value === null
    ) {
      return value;
    }
    if (isFunction(value)) {
      return (...args: Value[]) => value.internal['[[Call]]'](args);
    }
    const object = Object.create(null);
    Object.defineProperties(object, value.descriptors);
    return object;
  };
  const getReturnScope = (scope: Scope): Scope => R.map(getReturn, scope);
  const program = parse(source);
  const scope = {};
  const value = execute(scope)(program);
  return { value: getReturn(value), scope: getReturnScope(scope) };
};
export default evaluate;
