// let sub = (a, b) => a - b;
// eslint-disable-next-line
let not = a => 0 - a;
const mul = (a, b) => {
  const internal = (acc, a, b) =>
    b == 1 ? acc : internal(acc - not(a), a, b - 1);
  internal(a, a, b);
};
mul(4, 6);
