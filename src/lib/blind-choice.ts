import type {Product} from './types.ts';
import {parseAmount, sumPrices} from './money.ts';

export const traitLabels = {mono:'Монохром',cool:'Холодные оттенки',warm:'Тёплые оттенки',clean:'Лаконичное покрытие',pattern:'Выразительный рисунок'};
export type Trait=keyof typeof traitLabels;
// Deliberate editorial tags describe the visible finish, never its price or rarity.
const groups: {tags:Trait[];ids:string[]}[]=[
 {tags:['mono','clean'],ids:['swap-1557c8700f3a','baron-1a5f3d48-c150-4cf6-ad3a-9e5916c737c3','baron-1058eb36-9557-4a3c-bde0-12a4937ea9cd','swap-466dad7996bd','baron-765cbc04-26de-413a-97c4-27ad9bfb150c','baron-31bd019d-3af9-49e3-8df6-7ff2918fb067','swap-a36fe80a549b','baron-11915c97-9913-469f-8a22-27be8897762d']},
 {tags:['mono','pattern'],ids:['baron-83abe985-036c-4fc4-9eae-50dba886f7c5','baron-2543db74-1727-4fe4-b923-decbc9dd9d1e','baron-17bc1409-f27e-4b8d-bced-c703c60d054a','baron-43721b9f-3c8b-46a0-804e-f25990b74c34','baron-0e4fd888-26a4-4e5a-a122-161eb5d87e8d']},
 {tags:['cool','clean'],ids:['baron-4d87d012-3437-4ce8-8cdb-510b213f41d7','swap-f552ddd674fb','swap-8d1c7a992820','swap-522f63d89206','swap-a360a2cd8d9d','swap-792a31fd6da7','swap-118b28a7085c']},
 {tags:['cool','pattern'],ids:['baron-05740431-5c55-488c-9574-ea5b83637a00','swap-81a203d41995','baron-6144d89b-105c-482a-8dc0-07319aac4e69','swap-0a7a560b8522','swap-c3c3dcbd3587','baron-6d0c0135-396b-4479-ab70-0a8155b6b541','baron-dbd7237d-261c-4cbb-b704-1d55fdf0d91e','baron-d978599a-2b79-43a4-891c-53b03d01f487','baron-a2688596-7a1d-48bf-898c-779ad97102f5']},
 {tags:['warm','clean'],ids:['baron-116ac83e-d2ea-4804-8170-e13f2ef862b4','swap-0889d5f8f420','swap-e34d219eeaf3','swap-d2e14f099361','swap-978c1533a2f4']},
 {tags:['warm','pattern'],ids:['swap-ba19f94fd9cd','swap-75bd510204bb','baron-8f472a56-a332-4c38-b386-68497a9b9046','swap-d4de79734801','swap-35d1bd8ccb42','baron-9329f0e9-76fc-4ae9-947e-d4b6d9e405c4','baron-d245a0b8-ee63-4e67-9198-409841b76c87','baron-b0695984-55b6-4137-b90e-4e8b272c47fc','baron-ea5b71ef-436c-4b88-9527-4075708ea963']},
];
export const visualTraits:Record<string,Trait[]>=Object.fromEntries(groups.flatMap(g=>g.ids.map(id=>[id,g.tags])));
export const blindPairs = [
 ['swap-1557c8700f3a','baron-83abe985-036c-4fc4-9eae-50dba886f7c5'],
 ['baron-05740431-5c55-488c-9574-ea5b83637a00','swap-ba19f94fd9cd'],
 ['swap-75bd510204bb','swap-81a203d41995'],
 ['swap-522f63d89206','baron-8f472a56-a332-4c38-b386-68497a9b9046'],
 ['baron-2543db74-1727-4fe4-b923-decbc9dd9d1e','baron-4d87d012-3437-4ce8-8cdb-510b213f41d7'],
] as const;
export function tasteProfile(answers:string[]) {
 const valid=[...new Set(answers.filter((id,i)=>blindPairs[i]?.some(option=>option===id)))];
 const counts=Object.fromEntries(Object.keys(traitLabels).map(t=>[t,0])) as Record<Trait,number>;
 for(const id of valid)for(const tag of visualTraits[id]??[])counts[tag]++;
 const ranked=(Object.keys(counts) as Trait[]).filter(t=>counts[t]>0).sort((a,b)=>counts[b]-counts[a]);
 return {counts,ranked,chosen:valid};
}
export function recommendBlindBundle(products:Product[],answers:string[],budgetText:string){
 const budget=parseAmount(budgetText),profile=tasteProfile(answers);
 const pools=['pistol','rifle','knife'].map(category=>products.filter(p=>p.categoryId===category&&visualTraits[p.id]));
 const score=(p:Product)=>(visualTraits[p.id]??[]).reduce((n,t)=>n+profile.counts[t],0)+(profile.chosen.includes(p.id)?3:0);
 let minimum:number|null=null,best:Product[]|null=null,bestScore=-1,bestCost=Infinity;
 for(const p of pools[0])for(const r of pools[1])for(const k of pools[2]){
  const items=[p,r,k],cost=sumPrices(items.map(item=>item.priceMinor)).rub;
  minimum=minimum===null?cost:Math.min(minimum,cost);
  if(budget===null||budget<=0||cost>budget||profile.chosen.length!==blindPairs.length)continue;
  const fit=items.reduce((n,item)=>n+score(item),0);
  if(fit>bestScore||(fit===bestScore&&cost<bestCost)){best=items;bestScore=fit;bestCost=cost;}
 }
 return {items:best,minimum,budget,profile,invalidBudget:budget===null||budget<=0};
}
export type BlindSession={step:number;answers:string[];budget:string};
export const emptyBlindSession:BlindSession={step:-1,answers:[],budget:'30 000'};
