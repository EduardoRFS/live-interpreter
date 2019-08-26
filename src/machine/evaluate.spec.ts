import evaluate from './evaluate';
import { parseSource } from './serializer';
import Pool from './pool';

test('acc number', () => {
  const input = `
    CreateNumber 7
  `;
  const output = 7;
  expect(evaluate({}, parseSource(input)).acc).toBe(output);
});
test('scope with number', () => {
  const input = `
    CreateNumber 7
    StaScope output
  `;
  const output = { output: 7 };
  expect(evaluate({}, parseSource(input)).scope).toEqual(output);
});
test('closure', () => {
  const input = `
    CreateNumber 7
    StaScope a

    CreateNumber 6
    CreateClosure
    Mov f2, f1
    LdaScope a
    Sta f1
    LdaScope sum
    Call
    Return

    StaScope addSeven

    CreateNumber 4
    Sta f1
    LdaScope addSeven
    Call
  `;
  const output = 11;
  expect(
    evaluate(
      {
        sum(state) {
          const a = Pool.get(state.pool, 'f1') as number;
          const b = Pool.get(state.pool, 'f2') as number;
          return { ...state, acc: a + b };
        },
      },
      parseSource(input)
    ).acc
  ).toBe(output);
});
