import {formatMinor,chipsToRub} from "@/lib/money";
export function Price({minor,large=false}:{minor:number;large?:boolean}) {
  return <div className={`price ${large?"price-large":""} ${minor>=100_000_000?"price-long":""}`}><span className="price-main">{formatMinor(minor)} <small>Chips</small></span><small className="price-rub">≈ {formatMinor(chipsToRub(minor))} ₽</small></div>;
}
