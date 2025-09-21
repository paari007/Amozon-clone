import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js' ;

export const deliveryOptions = [
  {
    id : '1',
    deliveryDays: 7,
    deliveryPrice : 0
  },{
     id : '2',
    deliveryDays: 3,
    deliveryPrice : 499
  },{
     id : '3',
    deliveryDays: 1,
    deliveryPrice : 999
  }
];


export function getDeliveryOption(deliveryOptionId){
  let deliveryOption ;

  deliveryOptions.forEach((option)=>{
      if(deliveryOptionId === option.id){
        deliveryOption = option ;
      }
  }) ;

  return deliveryOption || deliveryOptions[0];
}

export function calculateDeliveryDate(deliveryOption){
        
          const today = dayjs();
          const deliveryDate = today.add(skipWeekEnd(deliveryOption.deliveryDays),'days');
          const dateString = deliveryDate.format('dddd, MMMM D') ;

          return dateString ;
};



 export function skipWeekEnd(days){
  const today = dayjs();
  let result = 0 ;
  for(let i=1 ; i<=days+result; i++){
     const loop = today.add(i,'days');
     if(loop.format('dddd') === 'Sunday' || loop.format('dddd') === 'Saturday' ){
      result++;
     }
  }
 return days + result ;

}