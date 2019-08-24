#!/usr/bin/env node
import fs from 'fs';
import R from 'ramda';
import evaluate from './evaluate';

const file = R.last(process.argv);
const source = fs.readFileSync(file).toString();
const { value } = evaluate(source);
console.log(value);
