/* eslint-disable @typescript-eslint/ban-types */
import {
  parse,
  TSESTree,
  AST_NODE_TYPES as type,
} from '@typescript-eslint/typescript-estree';
import R from 'ramda';
import Value from './value';
import Scope from './scope';

type Node = TSESTree.Node;
type T = {
  value: Value;
  scope: Scope;
};
const execute = (scope: Scope) => (node: Node): T => {
  const keep = (value: Value) => ({ scope, value });
  if (node.type === type.Identifier) {
    return keep(Scope.get(scope, node.name));
  }
  if (node.type === type.Literal) {
    if (
      typeof node.value === 'string' ||
      typeof node.value === 'number' ||
      typeof node.value === 'boolean'
    ) {
      return keep(node.value);
    }
    throw new Error(`unknown literal type ${node.value}`);
  }
  if (node.type === type.VariableDeclaration) {
    if (node.declarations.length !== 1) {
      throw new Error('declarations should have only one declaration at time');
    }
    const [declaration] = node.declarations;
    return execute(scope)(declaration);
  }
  if (node.type === type.VariableDeclarator) {
    if (node.init && node.id.type === type.Identifier) {
      // TODO: grr mutation
      // eslint-disable-next-line no-param-reassign

      const { value } = execute(scope)(node.init);
      return { value, scope: Scope.set(scope, node.id.name, value) };
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
    const run = (scope: Scope, keys: string[]) => (
      ...values: Value[]
    ): Value => {
      const keysFound = keys.slice(0, values.length);
      const clojureScope = { ...scope, ...R.zipObj(keysFound, values) };
      if (keys.length > values.length) {
        return run(clojureScope, keys.slice(values.length));
      }
      return execute(clojureScope)(node.body).value;
    };
    return keep(run(scope, keys));
  }
  if (node.type === type.BinaryExpression) {
    if (node.operator === '-') {
      const a = execute(scope)(node.left).value as any;
      const b = execute(scope)(node.right).value as any;
      return keep(a - b);
    }
    if (node.operator === '==') {
      const a = execute(scope)(node.left).value as any;
      const b = execute(scope)(node.right).value as any;
      return keep(a === b);
    }
    throw new Error(`unknown operator ${node.operator}`);
  }
  if (node.type === type.CallExpression) {
    const fn = execute(scope)(node.callee).value;
    const args = node.arguments
      .map(arg => execute(scope)(arg))
      .map(t => t.value);
    if (Value.isFunction(fn)) {
      return keep(fn(...args));
    }
    throw new Error(`${JSON.stringify(node.callee)} isn't a function`);
  }
  if (node.type === type.ConditionalExpression) {
    return execute(scope)(node.test)
      ? execute(scope)(node.consequent)
      : execute(scope)(node.alternate);
  }
  if (node.type === type.Program || node.type === type.BlockStatement) {
    return node.body.reduce(({ scope }, node) => execute(scope)(node), {
      scope,
    }) as T;
  }
  throw new Error(`unknown node type ${node.type}`);
};
const evaluate = (baseScope: Scope, source: string): T => {
  const program = parse(source);
  const { scope, value } = execute(Scope.fromNative(baseScope))(program);
  return {
    value: Value.toNative(value),
    scope: Scope.toNative(scope),
  };
};
export default evaluate;
