"use client";
import {useEffect,useMemo,useRef,useState} from "react";
import {usePathname,useSearchParams} from "next/navigation";
import {filterProducts,invalidPriceRange,type Filters} from "@/lib/filters";
import {games,gameId,itemNoun,type GameId} from "@/lib/games";
import {useShop} from "./shop-provider";
import {ProductCard} from "./products";
import {Icon} from "./icon";
import {ChoicePanel} from "./choice-panel";
import {useGameCatalog} from "./use-game-catalog";
const categoryAliases:Record<string,string>={rifle:'csgo_inventory_weapon_category_rifles',pistol:'csgo_inventory_weapon_category_pistols',knife:'sfui_invpanel_filter_melee',smg:'csgo_inventory_weapon_category_smgs',rifles:'csgo_inventory_weapon_category_rifles',pistols:'csgo_inventory_weapon_category_pistols',knives:'sfui_invpanel_filter_melee',gloves:'sfui_invpanel_filter_gloves',smgs:'csgo_inventory_weapon_category_smgs',heavy:'csgo_inventory_weapon_category_heavy'};
export function CatalogView(){
  const root=useRef<HTMLDivElement>(null);
  useEffect(()=>{root.current?.removeAttribute("data-motion-pending");},[]);
  const shop=useShop();const params=useSearchParams();
  const pathname=(process.env.NEXT_PUBLIC_BASE_PATH??"")+usePathname();
  const game=gameId(params.get('game')??(params.get('saved')==='1'?shop.favorites[0]?.split('-')[1]:null));const selectedGame=games.find(g=>g.id===game)!;
  const {catalog,error,retry}=useGameCatalog(game);
  const [showFilters,setShowFilters]=useState(false);
  const [page,setPage]=useState({key:'',count:24});const key=params.toString();
  const count=page.key===key?page.count:24;
  const rawCategory=params.get('category')??'all';
  const category=categoryAliases[rawCategory]??rawCategory;
  const filters:Filters={query:params.get("q")??"",category,condition:game==='cs2'?params.get("condition")??"":"",min:params.get("min")??"",max:params.get("max")??"",sort:params.get("sort")??"price-asc",stattrak:game==='cs2'&&params.get("stattrak")==="1"};
  function update(values:Record<string,string|boolean>){const next=new URLSearchParams(window.location.search);for(const [key,value] of Object.entries(values)){if(value===false||value===""||value==="all")next.delete(key);else next.set(key,value===true?"1":String(value));}window.history.replaceState(null,"",`${pathname}?${next}`);}
  function selectGame(value:GameId){update({game:value,category:'',condition:'',stattrak:false,sort:filters.sort==='float'?'price-asc':filters.sort});}
  function reset(){window.history.replaceState(null,'',`${pathname}?game=${game}`);}
  const invalidRange=invalidPriceRange(filters.min,filters.max);
  const saved=params.get('saved')==='1';
  const gameProducts=catalog?.products??[];
  const savedProducts=[...gameProducts.filter(p=>shop.favorites.includes(p.id)),...(game==='cs2'?shop.products.filter(p=>shop.favorites.includes(p.id)).map(p=>({...p,categoryId:categoryAliases[p.categoryId]??p.categoryId})):[])];
  const products=filterProducts(saved?savedProducts:gameProducts,filters);
  const categoryCounts=useMemo(()=>{const counts=new Map<string,number>();for(const p of catalog?.products??[])counts.set(p.categoryId,(counts.get(p.categoryId)??0)+1);return counts;},[catalog]);
  const active=Boolean(filters.query||category!=='all'||filters.condition||filters.min||filters.max||filters.stattrak||saved);
  const sorts=[{value:'price-asc',label:'Сначала дешевле'},{value:'price-desc',label:'Сначала дороже'},{value:'name-asc',label:'Название А–Я'},{value:'name-desc',label:'Название Я–А'}];
  return <div ref={root} data-motion-pending="" className="page-container catalog-page">
    <div className="catalog-intro"><h1>Твоя игра — твои детали</h1><p>Выбери игру. Найди свой предмет.</p></div>
    <div className="catalog-games" role="group" aria-label="Выбор игры">{games.map(g=><button key={g.id} aria-pressed={game===g.id} onClick={()=>selectGame(g.id)}><span className="game-name">{g.id==='tf2'?<><span className="game-full-name">{g.name}</span><span className="game-short-name">TF2</span></>:g.name}</span><span className="game-description">{g.description}</span><span className="game-mark" aria-hidden="true">{game===g.id?'↗':'+'}</span></button>)}</div>
    <div className="catalog-toolbar multi-game-toolbar">
      <label className="search-input"><Icon name="search"/><input type="search" aria-label="Поиск по предметам" placeholder={`Найти в ${selectedGame.name}`} value={filters.query} onChange={e=>update({q:e.target.value})}/>{filters.query&&<button aria-label="Очистить поиск" onClick={()=>update({q:''})}><Icon name="close" size={16}/></button>}</label>
      <div className="category-control"><ChoicePanel label="Категория" value={category} disabled={!catalog} options={[{value:'all',label:'Все категории',detail:`${gameProducts.length.toLocaleString('ru')} ${itemNoun(gameProducts.length)}`},...(catalog?.categories??[]).map(c=>({value:c.id,label:c.name,detail:`${categoryCounts.get(c.id)??0} ${itemNoun(categoryCounts.get(c.id)??0)}`}))]} onChange={value=>update({category:value})}/></div>
      <div className="sort-control"><ChoicePanel label="Сортировка" value={filters.sort} options={sorts} onChange={value=>update({sort:value})}/></div>
      <button className="button secondary filter-toggle" aria-expanded={showFilters} onClick={()=>setShowFilters(!showFilters)}><Icon name="filter"/>Фильтры</button>
    </div>
    <div className="catalog-layout">
      <aside className={`catalog-filters ${showFilters?'filters-open':''} ${game!=='cs2'?'simple-filters':''}`} aria-label="Фильтры каталога">
        <div className="filter-heading"><strong>Фильтры <Icon name="filter" size={16}/></strong>{active&&<button className="subtle-button" onClick={reset}>Сбросить</button>}</div>
        <fieldset><legend>Цена в Chips</legend><div className="price-range"><input aria-label="Цена от, Chips" placeholder="От" inputMode="decimal" value={filters.min} onChange={e=>update({min:e.target.value})}/><span>—</span><input aria-label="Цена до, Chips" placeholder="До" inputMode="decimal" value={filters.max} onChange={e=>update({max:e.target.value})}/></div><p className="fine-print">1 ₽ = 1,7 Chips</p>{invalidRange&&<p className="form-message" role="alert">Проверьте диапазон цен.</p>}</fieldset>
        {game==='cs2'&&<><fieldset><legend>Состояние</legend>{[["","Любое"],["FN","Прямо с завода"],["MW","Немного поношенное"],["FT","После полевых испытаний"],["WW","Поношенное"],["BS","Закалённое в боях"]].map(([code,name])=><label className="filter-option" key={code}><input type="radio" name="condition" checked={filters.condition===code} onChange={()=>update({condition:code})}/><span>{name}</span>{code&&<small>{code}</small>}</label>)}</fieldset><label className="filter-option stattrak-filter"><input type="checkbox" checked={filters.stattrak} onChange={e=>update({stattrak:e.target.checked})}/><span>Только StatTrak™</span></label></>}
      </aside>
      <section className="catalog-results" aria-label="Результаты поиска" aria-busy={!catalog&&!error}>
        <div className="catalog-results-bar"><div className="results-count" role="status"><span>{catalog?products.length.toLocaleString('ru'):'—'}</span> {itemNoun(products.length)} · {selectedGame.name}</div><button className={`saved-filter ${saved?'active':''}`} aria-pressed={saved} onClick={()=>update({saved:!saved})}><Icon name="heart" size={17}/>Избранное <span>{savedProducts.length}</span></button></div>
        {active&&<div className="filter-chips" aria-label="Активные фильтры">{filters.query&&<button onClick={()=>update({q:''})}>«{filters.query}» ×</button>}{category!=='all'&&<button onClick={()=>update({category:''})}>{catalog?.categories.find(c=>c.id===category)?.name??category} ×</button>}{filters.condition&&<button onClick={()=>update({condition:''})}>{filters.condition} ×</button>}{filters.stattrak&&<button onClick={()=>update({stattrak:false})}>StatTrak™ ×</button>}{(filters.min||filters.max)&&<button onClick={()=>update({min:'',max:''})}>Цена: {filters.min||'0'} — {filters.max||'∞'} Chips ×</button>}{saved&&<button onClick={()=>update({saved:false})}>Избранное ×</button>}<button onClick={reset}>Сбросить всё</button></div>}
        {error?<div className="empty-state" role="alert"><h2>Каталог не загрузился</h2><p>Проверь соединение и попробуй ещё раз.</p><button className="button primary" onClick={retry}>Повторить</button></div>:!catalog?<div className="catalog-loading" role="status"><span className="loading-mark" aria-hidden="true">/</span>Загружаем предметы {selectedGame.name}</div>:products.length?<><div className="product-grid">{products.slice(0,count).map(p=><ProductCard key={p.id} product={p}/>)}</div><div className="catalog-pagination"><span role="status">Показано {Math.min(count,products.length)} из {products.length.toLocaleString('ru')}</span>{count<products.length&&<button className="button secondary" onClick={()=>setPage({key,count:count+24})}>Показать ещё <Icon name="plus"/></button>}</div></>:<div className="empty-state"><Icon name="search" size={34}/><h2>Ничего не нашлось</h2><p>Попробуй другой запрос или сбрось фильтры.</p><button className="button primary" onClick={reset}>Сбросить фильтры</button></div>}
      </section>
    </div>
  </div>;
}
