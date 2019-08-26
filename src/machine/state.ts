import Value from './value';
import Instruction from './instruction';
import Scope from './scope';
import Pool from './pool';

type T = {
  acc: Value;
  pool: Pool;
  scope: Scope;
  stack: number[];
  index: number;
  instructions: readonly Instruction[];
};
type State = T;
const State = {};
export default State;
