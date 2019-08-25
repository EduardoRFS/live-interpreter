#!/usr/bin/env node
import fs from 'fs';
import R from 'ramda';
import evaluate from './evaluate';
import Value from './value';

const file = R.last(process.argv);
const source = fs.readFileSync(file).toString();
const { value } = evaluate(
  {
    log: (...args: Value[]) => {
      console.log(args);
      return R.last(args);
    },
  },
  source
);
console.log(value);
