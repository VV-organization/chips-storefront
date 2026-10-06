import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAmount,chipsToRub,rubToChips,steamQuote,sumPrices} from '../src/lib/money.ts';
test('decimal parsing and bounds',()=>{assert.equal(parseAmount('1 000,50'),100050);assert.equal(parseAmount('0.01'),1);for(const v of ['', '-1','NaN','Infinity','1e8','1.001','999999999999999'])assert.equal(parseAmount(v),null);});
test('Chips exchange 17/10 in both directions',()=>{assert.equal(rubToChips(100000),170000);assert.equal(chipsToRub(170000),100000);assert.equal(chipsToRub(100000),58824);assert.equal(rubToChips(100050),170085);});
test('half-up and validation',()=>{assert.equal(rubToChips(5),9);assert.equal(chipsToRub(1),1);assert.equal(chipsToRub(17),10);assert.throws(()=>chipsToRub(-1));assert.throws(()=>rubToChips(NaN));});
test('cart total rounds once',()=>{assert.deepEqual(sumPrices([1,1]),{chips:2,rub:1});assert.deepEqual(sumPrices([170000,340000]),{chips:510000,rub:300000});});
test('Steam fee stays separate',()=>{assert.deepEqual(steamQuote(100000),{amount:100000,fee:5000,total:105000});assert.deepEqual(steamQuote(10),{amount:10,fee:1,total:11});});
