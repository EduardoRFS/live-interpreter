import Register from './register';
import Instruction, { Opcode } from './instruction';

export const encode = (instruction: Instruction) => {
  const { opcode, ...args } = instruction;
  const body = Object.values(args).join(', ');
  return `${opcode} ${body}`;
};
export const decode = (data: string): Instruction => {
  const [opcode, ...body] = data
    .split(/\s/)
    .filter(Boolean)
    .map(part => part.trim().replace(/,/g, ''));
  // TODO: test if is a valid register
  if (opcode === Opcode.LdaScope && body.length === 1) {
    const [id] = body;
    return { opcode, id };
  }
  if (opcode === Opcode.StaScope && body.length === 1) {
    const [id] = body;
    return { opcode, id };
  }
  if (opcode === Opcode.Lda && body.length === 1) {
    const [source] = body;
    if (Register.isRegister(source)) {
      return { opcode, source };
    }
  }
  if (opcode === Opcode.Sta && body.length === 1) {
    const [destination] = body;
    if (Register.isRegister(destination)) {
      return { opcode, destination };
    }
  }
  if (opcode === Opcode.CreateNumber && body.length === 1) {
    const number = parseInt(body[0], 10);
    if (number === parseFloat(body[0])) {
      return { opcode, number };
    }
  }
  if (opcode === Opcode.CreateClosure && body.length === 0) {
    return { opcode };
  }
  if (opcode === Opcode.Mov && body.length === 2) {
    const [destination, source] = body;
    if (Register.isRegister(destination) && Register.isRegister(source)) {
      return { opcode, destination, source };
    }
  }
  if (opcode === Opcode.Call && body.length === 0) {
    return { opcode };
  }
  if (opcode === Opcode.Return && body.length === 0) {
    return { opcode };
  }
  throw new Error(`unknown code "${data}"`);
};
export const parseSource = (source: string): Instruction[] =>
  source
    .split('\n')
    .map(line => line.split('//')[0].trim())
    .filter(Boolean)
    .map(decode);
