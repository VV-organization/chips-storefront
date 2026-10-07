import type {Metadata} from 'next';
import localFont from 'next/font/local';
import {getCatalog} from '@/lib/catalog';
import {ShopProvider} from '@/components/shop-provider';
import {Header,Footer} from '@/components/shell';
import {QuickView} from '@/components/products';
import {PageMotion} from '@/components/motion';
import './globals.css';
const sans=localFont({src:'../../public/fonts/IBMPlexSans.ttf',variable:'--font-sans',display:'swap'});
export const metadata:Metadata={title:{default:'Chips — всё решают детали',template:'%s — Chips'},description:'Скины CS2, конструктор комплектов, слепой выбор и пополнение Steam. 1 ₽ = 1,7 Chips.',icons:{icon:`${process.env.NEXT_PUBLIC_BASE_PATH??''}/favicon.svg`}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru" data-scroll-behavior="smooth" className={sans.variable}><body><ShopProvider catalog={getCatalog()}><PageMotion/><Header/><main id="main">{children}</main><Footer/><QuickView/></ShopProvider></body></html>;}
