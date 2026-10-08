'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useRef,useState} from 'react';
import type {Product} from '@/lib/types';
import {useShop} from './shop-provider';
import {Price} from './price';
import {Icon} from './icon';
import {OrbitalField} from './orbital-field';
function artwork(p:Product){return p.imageUrl;}
export function Hero({products}:{products:Product[]}){
 const [active,setActive]=useState(0),shop=useShop(),product=products[active],objectRef=useRef<HTMLSpanElement>(null);if(!product)return null;
 return <section className="hero" aria-labelledby="hero-title"><div className="hero-stage" onPointerMove={e=>{if(e.pointerType==='touch'||matchMedia('(prefers-reduced-motion: reduce)').matches)return;const b=e.currentTarget.getBoundingClientRect();e.currentTarget.style.setProperty('--dx',`${(e.clientX-b.left-b.width/2)*.018}px`);e.currentTarget.style.setProperty('--dy',`${(e.clientY-b.top-b.height/2)*.018}px`);}} onPointerLeave={e=>{e.currentTarget.style.setProperty('--dx','0px');e.currentTarget.style.setProperty('--dy','0px');}}><OrbitalField objectRef={objectRef}/><div className="hero-index"><span className="micro-label">CHIPS / COUNTER-STRIKE 2</span><span className="micro-label">ТВОЙ ИНВЕНТАРЬ. ТВОЙ ХАРАКТЕР.</span></div><div className="hero-copy"><h1 id="hero-title"><span>Всё решают детали</span></h1><p><span>Находи своё. Собирай сочетания. Выходи в игру.</span></p><Link className="button primary" href="/catalog">Выбрать скин <Icon name="diagonal"/></Link></div><button className={`hero-object${active===0?' hero-object-rifle':''}`} onClick={()=>shop.setPreviewProduct(product)} aria-label={`Рассмотреть: ${product.name}`}><span className="hero-object-parallax"><span className="hero-object-float" ref={objectRef}><span className="hero-object-reveal" key={product.id}><Image src={artwork(product)} alt={product.name} width={1536} height={1024} loading="eager"/></span></span></span><span className="object-open"><Icon name="plus" size={18}/></span></button><div className="hero-selection"><div className="hero-product-caption"><span>{product.weapon}</span><strong>{product.finish}</strong><Price minor={product.priceMinor}/></div><div className="hero-selector" role="group" aria-label="Скин на обложке">{products.map((p,i)=><button key={p.id} aria-label={`Показать ${p.name}`} aria-pressed={active===i} onClick={()=>setActive(i)}><span>{String(i+1).padStart(2,'0')}</span><span>{p.weapon}</span><b>{active===i?'−':'+'}</b></button>)}</div></div><div className="hero-bottom"><span>1 ₽ <b>↔</b> 1,7 Chips</span><Link href="#topups">Дальше — больше <span>↓</span></Link></div></div></section>;
}
