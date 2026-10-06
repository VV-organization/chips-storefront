'use client';
import {useState} from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type {Catalog} from '@/lib/types';
import {Icon} from './icon';
export function CategoryDossiers({catalog}:{catalog:Catalog}){
 const [active,setActive]=useState('knife');
 return <section className="section categories" id="categories" aria-labelledby="categories-title"><div className="section-heading"><div><span className="section-index">03 / КАТЕГОРИИ</span><h2 id="categories-title">Каждому раунду — своё.</h2></div><p>Выбери тип оружия.<br/>{' '}Дальше — дело вкуса.</p></div><div className="category-list">{catalog.categories.map((c,i)=>{const pool=catalog.products.filter(p=>p.categoryId===c.id),p=pool[0],opened=active===c.id;return <article className={`category-row ${opened?'category-open':''}`} key={c.id}><button aria-expanded={opened} aria-controls={`category-${c.id}`} onClick={()=>setActive(opened?'':c.id)}><span className="category-number">0{i+1}</span><h3>{c.name}</h3><span className="category-count">{pool.length} предметов</span><Icon name={opened?'close':'plus'}/></button><div id={`category-${c.id}`} hidden={!opened} className="category-content"><p>{c.description}</p>{p&&<Image src={p.imageUrl} alt={p.name} width={500} height={250}/>}<Link href={`/catalog?category=${c.id}`} className="button secondary">Смотреть скины <Icon name="diagonal"/></Link></div></article>;})}</div></section>;
}
