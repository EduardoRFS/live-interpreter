import { evaluate } from '../src';

test('function and literal', () => {
  const { value } = evaluate({}, "() => 'TUTURU'") as { value: Function };
  expect(value).toBeInstanceOf(Function);
  expect(value()).toBe('TUTURU');
});
test('function arguments', () => {
  const { value: sub } = evaluate({}, '(a, b) => a - b') as { value: Function };
  expect(sub).toBeInstanceOf(Function);
  expect(sub(6, 7)).toBe(-1);
});
test('variable declaration', () => {
  const { scope } = evaluate({}, 'let sub = 9 - 4');
  expect(scope.sub).toBe(5);
});
test('function call', () => {
  const { value } = evaluate({}, 'let sub = (a, b) => a - b; sub(4, 6);');
  expect(value).toBe(-2);
});
test('auto currying', () => {
  const { value } = evaluate(
    {},
    'let sub = (a, b) => a - b; let subTwo = sub(2); subTwo(5)'
  );
  expect(value).toBe(-3);
});
