'use client';
import {useEffect,useState} from 'react';
import type {Catalog} from '@/lib/types';
import type {GameId} from '@/lib/games';
import {loadGameCatalog} from '@/lib/reference-catalog';
export function useGameCatalog(game:GameId){
 const [attempt,setAttempt]=useState(0);
 const [state,setState]=useState<{game:GameId;catalog:Catalog|null;error:boolean}>({game,catalog:null,error:false});
 useEffect(()=>{let active=true;loadGameCatalog(game).then(catalog=>{if(active)setState({game,catalog,error:false});}).catch(()=>{if(active)setState({game,catalog:null,error:true});});return()=>{active=false;};},[game,attempt]);
 const catalog=state.game===game?state.catalog:null;
 return {catalog,error:state.game===game&&state.error,retry:()=>{setState({game,catalog:null,error:false});setAttempt(n=>n+1);}};
}
