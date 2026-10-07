'use client';
import {useEffect,useRef,type RefObject} from 'react';
/** A quiet filament field inspired by OffPossible's spatial instrument. */
export function OrbitalField({objectRef}:{objectRef?:RefObject<HTMLSpanElement|null>}){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{
  const canvas=ref.current;if(!canvas)return;const ctx=canvas.getContext('2d');if(!ctx)return;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');let frame=0,w=1,h=1,visible=true,phase=0,lastTime=0;
  function draw(){
   ctx!.clearRect(0,0,w,h);const t=reduced.matches?0:phase;
   // One clock gives the filaments and the weapon the same slow, fluid rhythm.
   // Only the artwork moves; the button and its focus ring stay in place.
   const object=objectRef?.current;
   if(object){const a=t*.35;object.style.transform=reduced.matches?'none':`translate3d(${Math.sin(a)*18}px,${Math.sin(a*1.35)*20}px,0) rotateX(${Math.sin(a*.85)*5}deg) rotateY(${Math.sin(a+.4)*9}deg) rotateZ(${Math.sin(a*1.1)*4}deg)`;}
   for(let strand=0;strand<75;strand++){
    ctx!.beginPath();const n=strand/74;
    for(let i=0;i<=180;i++){
     const u=i/180*Math.PI*2;
     const r=.27+.085*Math.sin(u*3+t*.35+n*1.2);
     const x=w*.5+Math.cos(u+t*.08)*(r*w)+Math.sin(u*2+t*.3)*w*.085+(n-.5)*w*.12*Math.sin(u*2+.5);
     const y=h*.52+Math.sin(u)*(h*.36)+(n-.5)*h*.25*Math.cos(u*3+t*.2)+Math.cos(u*2+t*.2)*h*.14;
     if(i===0)ctx!.moveTo(x,y);else ctx!.lineTo(x,y);
    }
    ctx!.strokeStyle=`rgba(173,183,198,${.025+.09*Math.pow(Math.sin(n*Math.PI),2)})`;ctx!.lineWidth=.65;ctx!.stroke();
   }
  }
  function tick(now:number){if(lastTime)phase+=Math.min((now-lastTime)/1000,.05)*.54;lastTime=now;draw();if(visible&&!reduced.matches&&!document.hidden)frame=requestAnimationFrame(tick);}
  function restart(){cancelAnimationFrame(frame);lastTime=0;if(visible&&!document.hidden)tick(performance.now());}
  const resize=new ResizeObserver(entries=>{const b=entries[0].contentRect;w=b.width;h=b.height;const d=Math.min(devicePixelRatio,1.5);canvas.width=w*d;canvas.height=h*d;ctx.setTransform(d,0,0,d,0,0);draw();});resize.observe(canvas);
  const observer=new IntersectionObserver(([e])=>{visible=e.isIntersecting;restart();});observer.observe(canvas);
  reduced.addEventListener('change',restart);document.addEventListener('visibilitychange',restart);
  return()=>{cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();reduced.removeEventListener('change',restart);document.removeEventListener('visibilitychange',restart);};
 },[objectRef]);
 return <canvas ref={ref} className="orbital-field" aria-hidden="true"/>;
}
