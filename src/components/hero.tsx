'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useState,type CSSProperties} from 'react';
import type {Product} from '@/lib/types';
import {useShop} from './shop-provider';
import {Price} from './price';
import {Icon} from './icon';
import {OrbitalField} from './orbital-field';
export function Hero({products}:{products:Product[]}){
 const [active,setActive]=useState(0),shop=useShop(),product=products[active];
 if(!product)return null;
 return <section className="hero" aria-labelledby="hero-title">
  <div className="hero-stage" onPointerMove={e=>{if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--dx',`${(e.clientX-b.left-b.width/2)*.018}px`);e.currentTarget.style.setProperty('--dy',`${(e.clientY-b.top-b.height/2)*.018}px`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--dx','0px');e.currentTarget.style.setProperty('--dy','0px');}}>
   <OrbitalField/><span className="stage-annotation">СКИНЫ ДЛЯ COUNTER-STRIKE 2</span><span className="stage-cross" aria-hidden="true">+</span>
   <div className="hero-watermark" aria-hidden="true">chips</div>
   <button className="hero-object" onClick={()=>shop.setPreviewProduct(product)} aria-label={`Рассмотреть: ${product.name}`} key={product.id}>
    <Image src={product.imageUrl} alt={product.name} width={1000} height={650} priority sizes="(max-width:700px) 90vw, 65vw"/>
    <span className="object-fragments" aria-hidden="true">{[0,1,2].map(n=><span key={n} style={{'--fragment':n} as CSSProperties}><Image src={product.imageUrl} alt="" width={1000} height={650} priority/></span>)}</span>
    <span className="object-open"><Icon name="plus" size={19}/><span>Рассмотреть</span></span>
   </button>
   <div className="hero-product-caption"><div><span>{product.weapon}</span><strong>{product.finish}</strong></div><Price minor={product.priceMinor}/></div>
   <div className="hero-selector" role="group" aria-label="Скин на обложке">{products.map((p,i)=><button key={p.id} aria-label={`Показать ${p.name}`} aria-pressed={active===i} onClick={()=>setActive(i)}><span>0{i+1}</span><Image src={p.imageUrl} alt="" width={100} height={70}/></button>)}</div>
  </div>
  <div className="hero-editorial"><div className="hero-description"><span className="eyebrow">ТВОЙ СЛЕД В ИГРЕ</span><p>Один инвентарь.<br/>{' '}Тысячи способов быть собой.</p><span className="hero-rate">1 ₽ <span>↔</span> 1,7 Chips</span></div><div><h1 id="hero-title">Всё решают<br/><span>детали.</span></h1><div className="hero-cta"><Link className="button primary" href="/catalog">Выбрать скин <Icon name="diagonal"/></Link><Link href="#steam" className="text-link">Пополнить Steam <Icon name="arrow"/></Link></div></div></div>
 </section>;
}
