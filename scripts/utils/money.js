export function PriceFixer(priceCents){
  const priceCent = (Math.round(priceCents)/100).toFixed(2);
  return priceCent ;
}
