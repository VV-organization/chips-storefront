'use client';
import {useEffect,type HTMLAttributes,type ReactNode} from 'react';
import {usePathname} from 'next/navigation';

export function MotionHeading({as='h2',children,...props}:HTMLAttributes<HTMLHeadingElement>&{as?:'h1'|'h2';children:ReactNode}){const Tag=as;return <Tag {...props}>{children}</Tag>;}
export function RevealText({text}:{text:string}){return <span>{text}</span>;}

type Kind='type'|'strip'|'panel'|'object'|'rule';
const enteredHeader=new WeakSet<Element>();
// Atomic panels reveal their contents together; other scenes have a type/object/control sequence.
const coverage:Record<Kind,string>={
 panel:'.topup-panel form,.category-poster,.product-card,.cart-item,.faq-articles article,.blind-reveal>button,.blind-bundle article,.blind-option,.account-panel,.account-balance,.empty-basket,.empty-state,.choice-options>button',
 object:'.hero-object-reveal,.spectrum-object img,.compare-canvas,.slot-object img,.blind-mystery,.inspection-viewport,.detail-visual',
 type:'h1,h2,h3,h4,.price,.order-total,.converter-equation>label,.equation-equals,.footer-intro>p',
 rule:'.blind-track>span,.measure-track,.float-track,.spectrum-foot,.converter-rule,.footer-bottom',
 strip:'.main-nav>a,.header-actions>*,.section-index,.micro-label,.weapon-name,.eyebrow,.topup-title,p:not(.sr-only):not([role]),.button,.text-link,.choice-trigger,.palette-choices,.spectrum-dock,.hero-selector,.hero-bottom,.hero-product-caption,.slot-header,.loadout-budget>label,.budget-status,.catalog-category-tabs,.catalog-toolbar,.catalog-filters.filters-open,.breadcrumbs,.skin-specs,.payment-row,.detail-image-note,.inspection-top,.inspection-bottom,.inspection-tools,.blind-round-actions,.blind-profile,.blind-presets,.blind-intro-copy>small,.blind-stage-heading>span,.compare-readout dl,.compare-command>span,.compare-delta,.footer-index>a,.footer-logo,.account-sidebar,.account-section-label,.summary-line,.checkout-method,.cart-stage-label,.loadout-budget>.money-input,.blind-budget>div:last-child,.history-empty',
};
const candidates=Object.values(coverage).join(',');
const reveal:Record<Kind,{frames:Keyframe[];duration:number;delay:number}>={
 type:{frames:[{clipPath:'inset(100% -10px -10px)',translate:'0 .65em'},{clipPath:'inset(-10px)',translate:'0 0'}],duration:820,delay:45},
 strip:{frames:[{clipPath:'inset(-6px 100% -6px -6px)'},{clipPath:'inset(-6px)'}],duration:640,delay:95},
 panel:{frames:[{clipPath:'inset(0 100% 0 0)'},{clipPath:'inset(0)'}],duration:850,delay:100},
 object:{frames:[{clipPath:'inset(0 0 100% 0)',scale:'.96',rotate:'-1.5deg'},{clipPath:'inset(-12px)',scale:'1',rotate:'0deg'}],duration:1050,delay:120},
 rule:{frames:[{clipPath:'inset(-6px 100% -6px -6px)'},{clipPath:'inset(-6px)'}],duration:750,delay:0},
};

export function PageMotion(){
 const path=usePathname();
 useEffect(()=>{
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const records=new Map<HTMLElement,{kind:Kind;curtain:boolean;state:'waiting'|'running'|'done';animation?:Animation}>();
  const scope=document.querySelector('#main');
  if(!scope)return;
  let scanFrame=0;
  const inScope=(el:Element)=>!!el.closest('#main,.site-header,.site-footer,dialog[open]');
  function finish(el:HTMLElement){
   const record=records.get(el);if(!record)return;
   record.animation?.cancel();record.animation=undefined;record.state='done';
   el.dataset.motionState='done';observer.unobserve(el);
   if(el.closest('.site-header'))enteredHeader.add(el);
  }
  function start(el:HTMLElement,index=0){
   const record=records.get(el);if(!record||record.state!=='waiting')return;
   if(reduced.matches||el.contains(document.activeElement)||el.matches('button:hover,a:hover')){finish(el);return;}
   const intro=document.querySelector('.brand-intro');
   if(el.closest('.hero,.site-header')&&intro&&intro.getAttribute('data-state')!=='done')return;
   observer.unobserve(el);record.state='running';el.dataset.motionState='running';
   const spec=reveal[record.kind];
   const frames=record.curtain?[{transform:'scaleX(1)'},{transform:'scaleX(0)'}]:spec.frames;
   try{
    const animation=el.animate(frames,{duration:spec.duration,delay:spec.delay+Math.min(index*45,180),easing:'cubic-bezier(.22,1,.36,1)',fill:'both',...(record.curtain?{pseudoElement:'::after'}:{})});
    record.animation=animation;
    if(record.curtain&&(animation.effect as KeyframeEffect|null)?.pseudoElement!=='::after'){finish(el);return;}
    animation.finished.then(()=>{if(record.animation===animation)finish(el);}).catch(()=>{});
   }catch{finish(el);}
  }
  const observer=new IntersectionObserver(entries=>{
   entries.filter(e=>e.isIntersecting).sort((a,b)=>a.boundingClientRect.top-b.boundingClientRect.top||a.boundingClientRect.left-b.boundingClientRect.left).forEach((e,i)=>start(e.target as HTMLElement,i));
  },{threshold:.06,rootMargin:'0px 0px -24px 0px'});
  function scan(){
   // React retains ownership of text and layout: no runtime text splitting or wrapper insertion.
   document.querySelectorAll<HTMLElement>(candidates).forEach(el=>{
    if(records.has(el)||enteredHeader.has(el)||!inScope(el)||el.closest('.sr-only,[role="status"],.cart-notice,.brand-intro'))return;
    const ancestor=el.parentElement?.closest(candidates);
    if(ancestor&&inScope(ancestor))return;
    if(!el.getClientRects().length)return;
    const kind=(Object.keys(coverage) as Kind[]).find(key=>el.matches(coverage[key]))!;
    const curtain=kind==='panel'||el.matches('button,a,label')||!!el.querySelector('button,a,input');
    if(curtain){
     el.dataset.motionCurtain='';
     if(getComputedStyle(el).position==='static')el.dataset.motionPosition='relative';
     let surface:Element|null=el;
     while(surface){const color=getComputedStyle(surface).backgroundColor;if(color!=='rgba(0, 0, 0, 0)'&&color!=='transparent'){el.style.setProperty('--motion-cover',color);break;}surface=surface.parentElement;}
    }
    records.set(el,{kind,curtain,state:'waiting'});el.dataset.motionKind=kind;el.dataset.motionState='waiting';
    if(reduced.matches)finish(el);else observer.observe(el);
   });
   for(const [el,record] of records){
    if(!el.isConnected){record.animation?.cancel();observer.unobserve(el);records.delete(el);continue;}
    if(record.state==='waiting'&&el.closest('.hero,.site-header')){const r=el.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight)start(el);}
   }
  }
  function scheduleScan(){cancelAnimationFrame(scanFrame);scanFrame=requestAnimationFrame(scan);}
  function interact(event:Event){
   if(!(event.target instanceof Element))return;
   const control=event.target.closest('button,a,input,select,textarea');
   for(const [el,record] of records)if(record.state!=='done'&&(el.contains(event.target)||(control&&control.contains(el))))finish(el);
  }
  function preference(){if(reduced.matches)for(const el of records.keys())finish(el);}
  const changes=new MutationObserver(mutations=>{
   for(const mutation of mutations){
    if(mutation.type==='attributes'&&mutation.attributeName==='class'&&mutation.target instanceof HTMLElement&&mutation.target.matches('.catalog-filters')){
     const el=mutation.target,record=records.get(el);
     if(record){finish(el);if(el.classList.contains('filters-open')&&!reduced.matches){record.state='waiting';el.dataset.motionState='waiting';observer.observe(el);}}
    }
    if(mutation.type==='attributes'&&mutation.attributeName==='src'&&mutation.target instanceof HTMLImageElement){
     const el=mutation.target;const record=records.get(el);
     if(record?.kind==='object'&&!reduced.matches){record.animation?.cancel();record.state='waiting';el.dataset.motionState='waiting';observer.observe(el);}
    }
   }
   scheduleScan();
  });
  // Includes dynamic quiz results, filters and native dialogs outside main.
  changes.observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['src','open','data-state','class']});
  document.addEventListener('focusin',interact);document.addEventListener('pointerdown',interact,{passive:true});
  reduced.addEventListener('change',preference);window.addEventListener('resize',scheduleScan);scan();
  return()=>{cancelAnimationFrame(scanFrame);observer.disconnect();changes.disconnect();records.forEach((record,el)=>{record.animation?.cancel();delete el.dataset.motionState;delete el.dataset.motionKind;delete el.dataset.motionCurtain;delete el.dataset.motionPosition;el.style.removeProperty('--motion-cover');});document.removeEventListener('focusin',interact);document.removeEventListener('pointerdown',interact);reduced.removeEventListener('change',preference);window.removeEventListener('resize',scheduleScan);};
 },[path]);
 return null;
}
