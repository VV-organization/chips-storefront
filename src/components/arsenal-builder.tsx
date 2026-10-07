'use client';
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type {Product} from '@/lib/types';
import {duoQuote} from '@/lib/duo';
import {slots,recombine} from '@/lib/loadout';
import {formatMinor,chipsToRub} from '@/lib/money';
import {Icon} from './icon';
import {ChoicePanel} from './choice-panel';
import {Price} from './price';
import {useShop} from './shop-provider';
const labels=['Пистолет','Винтовка','Нож'];
export function ArsenalBuilder({products}:{products:Product[]}){
 const shop=useShop(),[ids,setIds]=useState<string[]>([]),[locked,setLocked]=useState([false,false,false]),[budget,setBudget]=useState('30 000'),[message,setMessage]=useState('');
 const pools=slots.map(s=>products.filter(p=>p.categoryId===s).sort((a,b)=>a.priceMinor-b.priceMinor));
 const chosen=pools.map((pool,i)=>pool.find(p=>p.id===ids[i])??pool[0]);if(chosen.some(p=>!p))return null;
 const quote=duoQuote(chosen.map(p=>p.priceMinor),budget),added=chosen.every(p=>shop.cart.some(c=>c.id===p.id));
 function pick(){const next=recombine(products,chosen,locked,budget);if(!next){setMessage('В этот бюджет комплект не помещается. Увеличь сумму или открепи дорогой предмет. Текущий выбор сохранён.');return;}const changed=next.some((p,i)=>p.id!==chosen[i].id);setIds(next.map(p=>p.id));setMessage(changed?'Новый комплект подобран. Закреплённые предметы сохранены.':'Это единственный подходящий комплект. Открепи предмет или увеличь бюджет, чтобы увидеть другие варианты.');}
 return <section className="section arsenal" id="arsenal" aria-labelledby="arsenal-title"><div className="section-heading"><div><h2 id="arsenal-title">Три вещи. Один характер</h2></div><p>Оставь любимый скин.<br/>{' '}Подбери к нему комплект по бюджету.</p></div><div className="arsenal-workspace"><div className="loadout-slots">{chosen.map((p,i)=><article className={`loadout-slot ${locked[i]?'is-pinned':''}`} key={slots[i]}><div className="slot-header"><span>0{i+1} / {labels[i]}</span><button aria-label={`${locked[i]?'Открепить':'Закрепить'}: ${labels[i]}`} aria-pressed={locked[i]} onClick={()=>{setLocked(locked.map((v,n)=>n===i?!v:v));setMessage('');}}><Icon name={locked[i]?'check':'plus'} size={15}/>{locked[i]?'Закреплён':'Закрепить'}</button></div><button className="slot-object" aria-label={`Рассмотреть комплект: ${p.name}`} onClick={()=>shop.setPreviewProduct(p)}><Image src={p.imageUrl} alt={p.name} width={400} height={300}/></button><span className="weapon-name">{p.weapon}</span><h3>{p.finish}</h3><Price minor={p.priceMinor}/><ChoicePanel label={`${labels[i]} в комплекте`} value={p.id} disabled={locked[i]} options={pools[i].map(p=>({value:p.id,label:`${p.weapon} · ${p.finish}`,detail:`${formatMinor(chipsToRub(p.priceMinor))} ₽ · ${p.condition}`,image:p.imageUrl}))} onChange={value=>{setIds(chosen.map((p,n)=>n===i?value:p.id));setMessage('');}}/></article>)}</div><div className="loadout-console"><div className="loadout-budget"><label htmlFor="arsenal-budget">Бюджет комплекта</label><div className="money-input"><input id="arsenal-budget" value={budget} inputMode="decimal" maxLength={12} aria-invalid={quote.budget===null} onChange={e=>{setBudget(e.target.value);setMessage('');}}/><span>₽</span></div><button className="button secondary" onClick={pick}><Icon name="swap" size={18}/>Подобрать сочетание</button></div><div className="loadout-summary"><div><span className="fine-print">ТРИ ПРЕДМЕТА</span><Price minor={quote.chips} large/></div><div><div className={`budget-status ${quote.withinBudget?'within':''}`} role="status">{quote.remaining===null?'Введите бюджет в рублях':quote.withinBudget?`В бюджете · остаток ${formatMinor(quote.remaining)} ₽`:`Выше бюджета на ${formatMinor(-quote.remaining)} ₽`}</div>{added?<Link href="/cart" className="button primary full" onClick={shop.dismissNotice}>Перейти в корзину <Icon name="arrow"/></Link>:<button className="button primary full" disabled={!quote.withinBudget} onClick={()=>shop.addMany(chosen)}>Добавить комплект <Icon name="plus"/></button>}</div></div></div>{message&&<p className="loadout-message" role="status">{message}</p>}</div></section>;
}
