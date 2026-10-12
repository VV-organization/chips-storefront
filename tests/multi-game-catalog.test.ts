import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {expandSnapshot,referencePrice,type ReferenceSnapshot} from '../src/lib/reference-catalog.ts';
import {emptyFilters,filterProducts,conditionCode} from '../src/lib/filters.ts';
import {productHref,hasWear} from '../src/lib/games.ts';
import {chipsToRub,parseAmount} from '../src/lib/money.ts';
import {readCartProducts} from '../src/lib/cart-products.ts';
const snapshot:ReferenceSnapshot={game:'rust',capturedAt:'2026-10-12',categories:[{id:'clothing',name:'Clothing'}],rows:[['d9b6cf75-2012-4529-8648-f4dc4c120c64','Red Beenie Hat','clothing','https://example.com/hat.png',504,'','','Red Beenie Hat']]};
test('reference currency converts through rubles with half-up rounding',()=>{
 assert.deepEqual(referencePrice(504),{rubMinor:857,chipsMinor:1457});
 assert.deepEqual(referencePrice(36),{rubMinor:61,chipsMinor:104});
 assert.deepEqual(referencePrice(5),{rubMinor:9,chipsMinor:15});
});
test('Rust is not labelled as a worn CS2 gun and uses a static-compatible detail URL',()=>{
 const p=expandSnapshot(snapshot).products[0];assert.equal(p.game,'rust');assert.equal(hasWear(p),false);assert.equal(conditionCode(p.condition),'');assert.equal(p.float,null);assert.equal(p.stattrak,false);assert.equal(p.priceMinor,1457);assert.equal(productHref(p),'/item?game=rust&id=d9b6cf75-2012-4529-8648-f4dc4c120c64');
});
test('CS2 accessories do not acquire a fictitious Battle-Scarred condition',()=>{
 const s:ReferenceSnapshot={...snapshot,game:'cs2',rows:[['123','Наклейка | Test','clothing','https://example.com/a.png',100,'','','Sticker | Test']]};assert.equal(hasWear(expandSnapshot(s).products[0]),false);
});
test('name sort, category, price and query compose for other games',()=>{
 const p=expandSnapshot(snapshot).products[0],rows=[p,{...p,id:'b',name:'Blue Hat',finish:'Blue Hat',priceMinor:2000}];
 assert.deepEqual(filterProducts(rows,{...emptyFilters,sort:'name-asc'}).map(p=>p.name),['Blue Hat','Red Beenie Hat']);
 assert.equal(filterProducts(rows,{...emptyFilters,query:'red',category:'clothing',max:'15'}).length,1);
 assert.equal(filterProducts(rows,{...emptyFilters,condition:'BS'}).length,0);
});
test('imported cart metadata survives reload and rejects malformed storage',()=>{
 const p=expandSnapshot(snapshot).products[0];assert.deepEqual(readCartProducts(JSON.stringify([p])),[p]);assert.deepEqual(readCartProducts('{bad'),[]);assert.deepEqual(readCartProducts(JSON.stringify([{...p,priceMinor:-1}])),[]);
});
for(const game of ['cs2','rust','tf2'])test(`${game}: complete snapshot has unique IDs, categories, images and price quotes`,()=>{
 const path=new URL(`../public/catalog-data/${game}.json`,import.meta.url);assert.ok(existsSync(path),`${game} import must finish`);
 const s=JSON.parse(readFileSync(path,'utf8')) as ReferenceSnapshot;
 const ids=new Set(s.rows.map(r=>r[0]));assert.equal(ids.size,s.rows.length);
 assert.ok(s.rows.length>100);assert.equal(s.rows.length,s.totalCount);const categories=new Set(s.categories.map(c=>c.id));
 for(const row of s.rows){assert.match(row[0],/^[a-f\d-]{36}$/);assert.ok(categories.has(row[2]));assert.ok(row[3]===""||/^https:\/\//.test(row[3]));assert.ok(Number.isSafeInteger(row[4])&&row[4]>0);}
 const products=expandSnapshot(s).products;assert.ok(products.every(p=>p.game===game&&Number.isSafeInteger(p.priceMinor)));if(game!=='cs2')assert.ok(products.every(p=>!hasWear(p)&&p.float===null));
});

test("expensive reference collectibles render and filter without widening top-up inputs",()=>{const price=referencePrice(1308781435);assert.equal(chipsToRub(price.chipsMinor),price.rubMinor);assert.equal(parseAmount("37823783.47"),null);assert.equal(parseAmount("37823783.47",10),3782378347);});

test("search also matches the original market name of a localized item",()=>{const p={...expandSnapshot(snapshot).products[0],name:"Красная шапка",marketHashName:"Red Beenie Hat"};assert.equal(filterProducts([p],{...emptyFilters,query:"beenie"}).length,1);});

test("a source item without artwork stays usable and survives cart reload",()=>{const p={...expandSnapshot(snapshot).products[0],imageUrl:""};assert.deepEqual(readCartProducts(JSON.stringify([p])),[p]);});
