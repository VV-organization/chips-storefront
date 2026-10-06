import type {Product} from './types.ts';
import {parseAmount,sumPrices} from './money.ts';
export const slots=['pistol','rifle','knife'] as const;
export function recombine(products:Product[],chosen:Product[],locked:boolean[],budget:string):Product[]|null{
 const limit=parseAmount(budget);if(limit===null||chosen.length!==3)return null;
 const pools=slots.map((category,i)=>locked[i]?[chosen[i]]:products.filter(p=>p.categoryId===category).sort((a,b)=>a.priceMinor-b.priceMinor));
 const feasible:Product[][]=[];
 for(const p of pools[0])for(const r of pools[1])for(const k of pools[2])if(sumPrices([p.priceMinor,r.priceMinor,k.priceMinor]).rub<=limit)feasible.push([p,r,k]);
 if(!feasible.length)return null;
 // Stable progression: never a paid random result. Locked items remain exact IDs.
 const current=feasible.findIndex(set=>set.every((p,i)=>p.id===chosen[i].id));
 return feasible[(current+1)%feasible.length];
}
