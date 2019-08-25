/* eslint-disable prefer-const */
let not = a => 0 - a;
let mul = (a, b) => {
  let internal = (acc, a, b) =>
    b == 1 ? acc : internal(acc - not(a), a, b - 1);
  internal(a, a, b);
};
mul(4, 6);
