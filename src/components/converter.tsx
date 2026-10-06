"use client";
import {MotionHeading} from './motion';
import {useId,useState} from "react";
import {parseAmount,chipsToRub,rubToChips,inputAmount} from "@/lib/money";
import {Icon} from "./icon";
export function Converter(){
  const id=useId();const [rub,setRub]=useState("1 000");const [chips,setChips]=useState("1 700");const [error,setError]=useState(false);
  function change(value:string,type:"rub"|"chips"){
    const update=type==="rub"?setRub:setChips; const other=type==="rub"?setChips:setRub;
    update(value);if(!value){other("");setError(false);return;}const amount=parseAmount(value);
    setError(amount===null);other(amount===null?"":inputAmount(type==="rub"?rubToChips(amount):chipsToRub(amount)));
  }
  return <section className="converter" aria-labelledby={id}><div className="converter-heading"><span className="section-index">06 / КОНВЕРТЕР</span><MotionHeading as="h2" id={id}>Простой курс.</MotionHeading></div><div className="converter-fields"><label><span className="sr-only">Рубли</span><input aria-label="Рубли" value={rub} inputMode="decimal" maxLength={12} onChange={e=>change(e.target.value,"rub")} aria-invalid={error}/><span>₽</span></label><span className="convert-icon"><Icon name="swap"/></span><label><span className="sr-only">Chips</span><input aria-label="Chips" value={chips} inputMode="decimal" maxLength={12} onChange={e=>change(e.target.value,"chips")} aria-invalid={error}/><span>Chips</span></label></div><div className="converter-rate"><strong>1 ₽ = 1,7 Chips</strong><span>{error?"Введите корректную сумму":"Можно изменить любую сумму"}</span></div>{error&&<p className="converter-error" role="status">Введите корректную сумму: до двух знаков после запятой.</p>}</section>;
}
