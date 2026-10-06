'use client';
import {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type {Product} from '@/lib/types';
import {curatedColors,type DiscoveryColor} from '@/lib/discovery';
import {useShop} from './shop-provider';
import {Price} from './price';
import {CartAction} from './products';
import {Icon} from './icon';
const palettes=[{id:'mono' as const,label:'Монохром',color:'#c6c9d0'},{id:'blue' as const,label:'Холодный',color:'#70a8d0'},{id:'orange' as const,label:'Тёплый',color:'#b77b50'}];
export function Spectrum({products}:{products:Product[]}){
 const [color,setColor]=useState<DiscoveryColor>('mono'),[index,setIndex]=useState(0),shop=useShop();
 const pool=curatedColors[color].flatMap(id=>products.filter(p=>p.id===id)),current=pool[index]??pool[0];if(!current)return null;
 return <section className="section spectrum" id="collection" aria-labelledby="spectrum-title"><div className="section-heading"><div><span className="section-index">01 / ПОДБОРКА</span><h2 id="spectrum-title">Попади в свой цвет.</h2></div><Link href="/catalog" className="text-link">Все скины <Icon name="diagonal"/></Link></div><div className="spectrum-workspace"><div className="spectrum-controls"><p>Один оттенок.<br/>Совсем другой характер.</p><div className="palette-choices" role="group" aria-label="Цветовая подборка">{palettes.map(p=><button aria-pressed={color===p.id} key={p.id} onClick={()=>{setColor(p.id);setIndex(0);}}><i style={{background:p.color}}/>{p.label}<span>{color===p.id?'↗':'+'}</span></button>)}</div><span className="fine-print">Подборка по цвету покрытия.<br/>Оригинальные изображения скинов.</span></div><div className="spectrum-stage"><span className="spectrum-backword" aria-hidden="true">{current.weapon}</span><div className="spectrum-stage-meta"><span>0{index+1} / 0{pool.length}</span><button className="icon-button" aria-label={`${shop.favorites.includes(current.id)?'Убрать из избранного':'В избранное'}: ${current.name}`} aria-pressed={shop.favorites.includes(current.id)} onClick={()=>shop.toggleFavorite(current.id)}><Icon name="heart"/></button></div><button className="spectrum-object" onClick={()=>shop.setPreviewProduct(current)} aria-label={`Быстрый просмотр: ${current.name}`} key={current.id}><Image src={current.imageUrl} alt={current.name} width={800} height={500}/><span>Рассмотреть <Icon name="plus" size={15}/></span></button><div className="spectrum-bottom"><div><span className="weapon-name">{current.weapon}</span><h3><Link href={`/catalog/${current.id}`}>{current.finish}</Link></h3><span className="fine-print">{current.condition}</span></div><Price minor={current.priceMinor}/><CartAction product={current} added={shop.cart.some(p=>p.id===current.id)} compact/></div></div></div><div className="spectrum-film" role="group" aria-label="Предметы подборки">{pool.map((p,i)=><button key={p.id} aria-label={`Выбрать ${p.name}`} aria-pressed={index===i} onClick={()=>setIndex(i)}><span>0{i+1}</span><Image src={p.imageUrl} alt="" width={180} height={110}/><span>{p.weapon}<strong>{p.finish}</strong></span></button>)}</div></section>;
}
