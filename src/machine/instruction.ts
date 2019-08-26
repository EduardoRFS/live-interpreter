import Register from './register';

export enum Opcode {
  LdaScope = 'LdaScope',
  StaScope = 'StaScope',
  Lda = 'Lda',
  Sta = 'Sta',
  CreateNumber = 'CreateNumber',
  CreateClosure = 'CreateClosure',
  Mov = 'Mov',
  Call = 'Call',
  Return = 'Return',
}

type LoadScopeAccumulator = {
  opcode: Opcode.LdaScope;
  id: string;
};
type StoreScopeAccumulator = {
  opcode: Opcode.StaScope;
  id: string;
};
type LoadAccumulator = {
  opcode: Opcode.Lda;
  source: Register;
};
type StoreAccumulator = {
  opcode: Opcode.Sta;
  destination: Register;
};
type CreateNumber = {
  opcode: Opcode.CreateNumber;
  number: number;
};
type CreateClosure = {
  opcode: Opcode.CreateClosure;
};
type Mov = {
  opcode: Opcode.Mov;
  destination: Register;
  source: Register;
};
// TODO: call with more arguments
type Call = {
  opcode: Opcode.Call;
};
type Return = {
  opcode: Opcode.Return;
};

type Instruction =
  | LoadScopeAccumulator
  | StoreScopeAccumulator
  | LoadAccumulator
  | StoreAccumulator
  | CreateNumber
  | CreateClosure
  | Mov
  | Call
  | Return;
const Instruction = {};
export default Instruction;
