import type {Catalog} from '@/lib/types';
import {Hero} from './hero';
import {BlindChoice} from './blind-choice';
import {Topups} from './topups';
import {Spectrum} from './spectrum';
import {HelpDesk} from './help-desk';
import {SkinCompare} from './skin-compare';
import {CategoryDossiers} from './category-dossiers';
import {ArsenalBuilder} from './arsenal-builder';
import {Converter} from './converter';
export function Home({catalog}:{catalog:Catalog}){const ids=['swap-ba19f94fd9cd','swap-f552ddd674fb','swap-35d1bd8ccb42'];const selected=ids.flatMap(id=>catalog.products.filter(p=>p.id===id));return <div className="home"><Hero products={selected}/><BlindChoice products={catalog.products}/><Topups/><Spectrum products={catalog.products}/><SkinCompare products={catalog.products}/><CategoryDossiers catalog={catalog}/><ArsenalBuilder products={catalog.products}/><Converter/><HelpDesk/></div>;}
