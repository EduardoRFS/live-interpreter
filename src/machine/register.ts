const names = ['f1', 'f2', 'f3', 'f4'] as const;
const Register = {
  names,
  isRegister: (reg: string): reg is Register =>
    (names as readonly string[]).includes(reg),
};
type Register = typeof names[number];
export default Register;
