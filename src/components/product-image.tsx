'use client';
import Image,{type ImageProps} from 'next/image';
import {useState} from 'react';
/** Network artwork has an explicit fallback instead of a broken-image icon. */
export function ProductImage(props:ImageProps){
 const [failed,setFailed]=useState<string|null>(null);
 const src=String(props.src);
 return !src||failed===src?<span className="image-unavailable" role="img" aria-label={props.alt}>Изображение<br/>недоступно</span>:<Image {...props} alt={props.alt} onError={()=>setFailed(src)}/>;
}
