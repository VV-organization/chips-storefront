'use client';
import {useMemo,useRef,useSyncExternalStore} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type {Product} from '@/lib/types';
import {blindPairs,emptyBlindSession,readBlindSession,recommendBlindBundle,traitLabels,visualTraits,type BlindSession} from '@/lib/blind-choice';
import {createSafeStorage} from '@/lib/browser-storage';
import {formatMinor,sumPrices} from '@/lib/money';
import {useShop} from './shop-provider';
import {Price} from './price';
import {Icon} from './icon';

const storage=createSafeStorage(()=>localStorage),key='chips:blind-choice:v1',empty=JSON.stringify(emptyBlindSession);
function subscribe(notify:()=>void){
 const external=(event:StorageEvent)=>{if(event.key===key||event.key===null){storage.invalidate(event.key);notify();}};
 window.addEventListener('storage',external);window.addEventListener('chips-blind-choice',notify);
 return()=>{window.removeEventListener('storage',external);window.removeEventListener('chips-blind-choice',notify);};
}
function save(session:BlindSession){storage.write(key,JSON.stringify(session));window.dispatchEvent(new Event('chips-blind-choice'));}
export function BlindChoice({products}:{products:Product[]}){
 const shop=useShop(),title=useRef<HTMLHeadingElement>(null);
 const raw=useSyncExternalStore(subscribe,()=>storage.read(key,empty),()=>empty);
 const session=useMemo(()=>readBlindSession(raw),[raw]);
 const {step,answers,budget}=session;
 const available=useMemo(()=>new Map(products.map(p=>[p.id,p])),[products]);
 const complete=step===blindPairs.length;
 const recommendation=useMemo(()=>complete?recommendBlindBundle(products,answers,budget):null,[products,answers,budget,complete]);
 const bundle=recommendation?.items,added=!!bundle&&bundle.every(p=>shop.cart.some(c=>c.id===p.id));
 const total=bundle?sumPrices(bundle.map(p=>p.priceMinor)):null;
 const ready=blindPairs.every(pair=>pair.every(id=>available.has(id)));
 function go(next:number){save({...session,step:next});title.current?.focus();}
 function restart(){save({...emptyBlindSession,step:0,budget});title.current?.focus();}
 function choose(id:string){const next=[...answers];next[step]=id;save({...session,answers:next});}
 function reason(p:Product){
  if(recommendation?.profile.chosen.includes(p.id))return 'Ты выбрал этот скин вслепую.';
  const shared=(visualTraits[p.id]??[]).filter(t=>recommendation?.profile.counts[t]).map(t=>traitLabels[t].toLowerCase());
  return shared.length?`Общее с твоим выбором: ${shared.join(', ')}.`:'Дополняет комплект в пределах бюджета.';
 }
 const picked=step>=0?answers[step]:undefined;
 return <section className="section blind-choice" id="blind-choice" aria-labelledby="blind-title">
  <header className="blind-heading"><div><span className="section-index">CHIPS / СЛЕПОЙ ВЫБОР</span><h2 id="blind-title">Сначала — взгляд.<br/><em>Потом — всё остальное.</em></h2></div><p>Название и цена подождут.<br/>Пять пар. Только твой вкус.</p></header>
  {!ready?<p className="blind-unavailable">Для слепого выбора пока недостаточно предметов. <Link className="text-link" href="/catalog">Посмотреть каталог <Icon name="arrow" size={16}/></Link></p>:<>
   <div className="blind-track" aria-label="Этапы слепого выбора">{blindPairs.map((_,i)=><span key={i} className={`${answers[i]?'is-done':''} ${step===i?'is-current':''}`} aria-current={step===i?'step':undefined}><b>{String(i+1).padStart(2,'0')}</b><i/></span>)}<span className={complete?'is-current':''}><b>↗</b><i/></span></div>
   <div className="blind-stage-heading"><h3 ref={title} tabIndex={-1}>{step<0?'Что ты выберешь, не зная цены?':complete?'Твой выбор. Без подсказок.':`Пара ${step+1} из ${blindPairs.length}. Что ближе?`}</h3><span className="micro-label">{step<0?'~ 30 СЕКУНД':complete?'НАЗВАНИЯ РАСКРЫТЫ':'ЦЕНЫ И НАЗВАНИЯ СКРЫТЫ'}</span></div>
   <p className="sr-only" role="status" aria-live="polite">{complete?'Выбор раскрыт. Теперь можно посмотреть названия и подобрать комплект.':step>=0?`Пара ${step+1} из 5. ${picked?'Вариант выбран. Можно продолжить.':'Выберите один из двух вариантов.'}`:''}</p>
   {step<0?<div className="blind-intro"><div className="blind-intro-number" aria-hidden="true">A<span>/</span>B</div><div className="blind-intro-copy"><p>Выбирай покрытие, которое цепляет. В конце раскроем твои пять скинов и соберём пистолет, винтовку и нож под твой бюджет.</p><button className="button primary" onClick={()=>go(0)}>Довериться взгляду <Icon name="arrow"/></button><small>Ответы сохраняются в этом браузере.</small></div></div>:
   !complete?<>
    <div className="blind-duel" role="group" aria-label={`Визуальная пара ${step+1}`}>
     {blindPairs[step].map((id,i)=>{const p=available.get(id)!;const letter=i===0?'A':'B';return <button key={`${step}-${id}`} className={`blind-option ${picked===id?'is-chosen':''}`} aria-label={`Выбрать вариант ${letter}`} aria-pressed={picked===id} aria-describedby={`blind-description-${i}`} onClick={()=>choose(id)}><span className="blind-option-top"><b>{letter}</b><span>{picked===id?'МОЙ ВЫБОР':'ПОКРЫТИЕ '+letter}</span><Icon name={picked===id?'check':'plus'} size={20}/></span><Image src={p.imageUrl} alt={(visualTraits[id]??[]).map(t=>traitLabels[t]).join(', ')} width={600} height={400} loading="eager"/><span id={`blind-description-${i}`} className="sr-only">{(visualTraits[id]??[]).map(t=>traitLabels[t]).join(', ')}</span><span className="blind-option-bottom">{picked===id?'Оставить этот':'Нравится этот'} <Icon name="diagonal" size={20}/></span></button>;})}
    </div>
    <div className="blind-round-actions"><button className="text-link" disabled={step===0} onClick={()=>go(step-1)}>← Предыдущая пара</button><button className="button primary" disabled={!picked} onClick={()=>go(step+1)}>{step===4?'Раскрыть мой выбор':'Следующая пара'} <Icon name="arrow"/></button></div>
   </>:<div className="blind-result">
    <div className="blind-profile"><p>Чаще выбираешь: <strong>{recommendation?.profile.ranked.slice(0,2).map(t=>traitLabels[t].toLowerCase()).join(' + ')}.</strong></p><button className="text-link" onClick={()=>go(4)}>Изменить ответы</button><button className="text-link" onClick={restart}>Пройти заново <Icon name="swap" size={15}/></button></div>
    <div className="blind-reveal">{answers.map((id,i)=>{const p=available.get(id);return p?<button key={id} onClick={()=>shop.setPreviewProduct(p)} aria-label={`Раскрытый скин ${i+1}: ${p.name}`}><span className="micro-label">0{i+1} / ТВОЙ ВЫБОР</span><Image src={p.imageUrl} alt={p.name} width={300} height={220}/><span className="weapon-name">{p.weapon}</span><strong>{p.finish}</strong><Price minor={p.priceMinor}/><span className="blind-reveal-link">Рассмотреть ↗</span></button>:null;})}</div>
    <div className="blind-budget"><div><span className="micro-label">СОБРАНО ПО ТВОИМ ОТВЕТАМ</span><h3>Твой вкус.<br/>Твой бюджет.</h3><p>Подбираем по цвету и рисунку выбранных покрытий. При одинаковом совпадении выбираем более доступный комплект.</p></div><div><label htmlFor="blind-budget">Бюджет на три предмета</label><div className="money-input"><input id="blind-budget" inputMode="decimal" value={budget} maxLength={12} aria-invalid={recommendation?.invalidBudget} aria-describedby="blind-budget-status" onChange={e=>save({...session,budget:e.target.value})}/><span>₽</span></div><div className="blind-presets">{['10000','30000','100000'].map(value=><button key={value} onClick={()=>save({...session,budget:value})}>{formatMinor(Number(value)*100)} ₽</button>)}</div><p id="blind-budget-status" role="status">{recommendation?.invalidBudget?'Введи сумму больше нуля в рублях.':!bundle?recommendation?.minimum?`Полный комплект доступен от ${formatMinor(recommendation.minimum)} ₽. Увеличь бюджет или рассмотри скины по одному выше.`:'Сейчас не хватает доступных предметов для полного комплекта.':`Три предмета в бюджете. Остаток ${formatMinor(recommendation!.budget!-total!.rub)} ₽.`}</p></div></div>
    {bundle&&total&&<><div className="blind-bundle">{bundle.map(p=><article key={p.id}><button className="blind-bundle-image" aria-label={`Рассмотреть рекомендацию: ${p.name}`} onClick={()=>shop.setPreviewProduct(p)}><Image src={p.imageUrl} alt={p.name} width={480} height={320}/></button><span className="weapon-name">{p.weapon}</span><h4>{p.finish}</h4><p>{reason(p)}</p><Price minor={p.priceMinor}/></article>)}</div><div className="blind-total"><div><span className="micro-label">КОМПЛЕКТ ИЗ ТРЁХ ПРЕДМЕТОВ</span><Price minor={total.chips} large/></div>{added?<Link className="button primary" href="/cart" onClick={shop.dismissNotice}>Перейти в корзину <Icon name="arrow"/></Link>:<button className="button primary" onClick={()=>shop.addMany(bundle)}>Добавить подобранный комплект <Icon name="plus"/></button>}</div></>}
   </div>}
  </>}
 </section>;
}
