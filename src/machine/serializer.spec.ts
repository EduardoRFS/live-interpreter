import { encode, decode, parseSource } from './serializer';
import Instruction, { Opcode } from './instruction';

test('encode', () => {
  const input: Instruction = {
    opcode: Opcode.Lda,
    source: 'f1',
  };
  const output = 'Lda f1';
  expect(encode(input)).toBe(output);
});
test('decode', () => {
  const input = 'Sta f1';
  const output = {
    opcode: Opcode.Sta,
    destination: 'f1',
  };
  expect(decode(input)).toEqual(output);
});
test('parseSource', () => {
  const input = `
    CreateNumber 4 // acc = 4
    Sta f1 // f1 = acc
    LdaScope addSeven // acc = scope.addSeven
    Call // acc = 11
  `;
  const output = [
    { opcode: Opcode.CreateNumber, number: 4 },
    { opcode: Opcode.Sta, destination: 'f1' },
    { opcode: Opcode.LdaScope, id: 'addSeven' },
    { opcode: Opcode.Call },
  ];
  expect(parseSource(input)).toEqual(output);
});
