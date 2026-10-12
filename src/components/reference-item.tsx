'use client';
import Link from 'next/link';
import {useSearchParams} from 'next/navigation';
import {gameId} from '@/lib/games';
import {ProductCard,ProductDetails} from './products';
import {useGameCatalog} from './use-game-catalog';
export function ReferenceItem(){
 const params=useSearchParams();const game=gameId(params.get('game'));const {catalog,error,retry}=useGameCatalog(game);
 const product=catalog?.products.find(p=>p.referenceId===params.get('id'));
 if(error)return <div className="page-container empty-state"><h1>Предмет не загрузился</h1><button className="button primary" onClick={retry}>Повторить</button></div>;
 if(!catalog)return <div className="page-container catalog-loading" role="status">Загружаем предмет…</div>;
 if(!product)return <div className="page-container empty-state"><h1>Предмет не найден</h1><Link href={`/catalog?game=${game}`} className="button primary">Вернуться в каталог</Link></div>;
 return <div className="page-container detail-page"><nav className="breadcrumbs" aria-label="Хлебные крошки"><Link href="/">Главная</Link><span>/</span><Link href={`/catalog?game=${game}`}>Каталог</Link><span>/</span><span>{product.name}</span></nav><ProductDetails key={product.id} product={product}/><section className="section"><div className="section-heading"><h2>Ещё в твоём стиле</h2><Link className="text-link" href={`/catalog?game=${game}&category=${encodeURIComponent(product.categoryId)}`}>Вся категория ↗</Link></div><div className="product-grid">{catalog.products.filter(p=>p.categoryId===product.categoryId&&p.id!==product.id).slice(0,4).map(p=><ProductCard key={p.id} product={p}/>)}</div></section></div>;
}
