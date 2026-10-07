'use client';

import {useEffect,useRef} from 'react';

let played=false;

export function BrandIntro(){
 const ref=useRef<HTMLDivElement>(null);
 useEffect(()=>{
  const root=ref.current;
  const target=document.querySelector<HTMLElement>('.site-header .wordmark');
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  if(!root)return;
  if(!target||played||location.hash||scrollY>24||motion.matches){root.dataset.state='done';return;}
  const animations:Animation[]=[];
  let frame=0;
  let timer:ReturnType<typeof setTimeout>|undefined;
  function finish(reveal=true){
   cancelAnimationFrame(frame);
   root!.removeAttribute('data-playing');
   root!.dataset.state=reveal?'done':'pending';
   document.body.removeAttribute('data-brand-intro');
   animations.forEach(animation=>animation.cancel());
   if(timer)clearTimeout(timer);
  }
  // Starting on the next frame also makes Strict Mode's setup/cleanup safe.
  frame=requestAnimationFrame(()=>{
   played=true;
   const plate=root.querySelector<HTMLElement>('.brand-intro-plate')!;
   const word=root.querySelector<HTMLElement>('.brand-intro-word')!;
   const rect=target.getBoundingClientRect();
   const width=Math.min(innerWidth*.82,640),height=width*.48;
   const left=(innerWidth-width)/2,top=(innerHeight-height)/2;
   const size=width*.29;
   root.dataset.state='playing';
   root.dataset.playing='';
   document.body.dataset.brandIntro='';
   const timing={duration:2400,fill:'both' as const,easing:'linear'};
   const ease='cubic-bezier(.76,0,.24,1)';
   animations.push(plate.animate([
    {left:`${left}px`,top:`${top+height/2}px`,width:`${width}px`,height:'2px',offset:0,easing:ease},
    {left:`${left}px`,top:`${top}px`,width:`${width}px`,height:`${height}px`,offset:.25,easing:ease},
    {left:`${left}px`,top:`${top}px`,width:`${width}px`,height:`${height}px`,offset:.48,easing:ease},
    {left:`${left}px`,top:`${top+height*.12}px`,width:`${width}px`,height:`${height*.76}px`,offset:.64,easing:ease},
    {left:`${rect.left-10}px`,top:`${rect.top-8}px`,width:`${rect.width+20}px`,height:`${rect.height+16}px`,background:'#000',offset:.96},
    {left:`${rect.left-10}px`,top:`${rect.top-8}px`,width:`${rect.width+20}px`,height:`${rect.height+16}px`,background:getComputedStyle(document.body).backgroundColor,offset:1},
   ],timing));
   animations.push(word.animate([
    {fontSize:`${size}px`,offset:0},
    {fontSize:`${size}px`,offset:.64,easing:ease},
    {fontSize:getComputedStyle(target).fontSize,offset:.96},
    {fontSize:getComputedStyle(target).fontSize,offset:1},
   ],timing));
   root.querySelectorAll('.brand-intro-letter').forEach((letter,i)=>{
    animations.push(letter.animate([{transform:'translateY(115%)'},{transform:'translateY(0)'}],{duration:650,delay:380+i*65,easing:'cubic-bezier(.16,1,.3,1)',fill:'both'}));
   });
   timer=setTimeout(finish,2400);
  });
  function interrupt(){played=true;finish();}
  const events=['pointerdown','wheel','touchstart','keydown','resize','scroll','pagehide'] as const;
  events.forEach(event=>window.addEventListener(event,interrupt,{passive:true}));
  motion.addEventListener('change',interrupt);
  return()=>{finish(false);events.forEach(event=>window.removeEventListener(event,interrupt));motion.removeEventListener('change',interrupt);};
 },[]);
 return <div ref={ref} className="brand-intro" data-state="pending" aria-hidden="true"><div className="brand-intro-plate"><div className="brand-intro-word">{'chips/'.split('').map((letter,i)=><span className="brand-intro-letter" key={i}>{letter}</span>)}</div></div></div>;
}
