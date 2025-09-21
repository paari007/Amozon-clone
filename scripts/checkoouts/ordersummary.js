import { cart,removeFromCart,calculateCartQuantity,updateQuantity,updateDeliveryOption, saveToStorage} from "../../data/cart.js";
import { products,getProduct } from "../../data/products.js";
import { PriceFixer } from "../utils/money.js";
import { deliveryOptions,getDeliveryOption,calculateDeliveryDate} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./renderPaymentSummary.js";

export function renderOrderSummary(){

    let orderSummaryHTML ='';

    cart.forEach((cartItem)=>{
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

        const deliveryOptionId = cartItem.deliveryOptionId ;

        const deliveryOption = getDeliveryOption(deliveryOptionId);

       const dateString = calculateDeliveryDate(deliveryOption);


      orderSummaryHTML+=
    `
      <div class="cart-item-container
      js-cart-item-container
      js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                  Delivery date: ${dateString}
                </div>

                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${matchingProduct.image}">

                  <div class="cart-item-details">
                    <div class="product-name">
                    ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                      $${PriceFixer(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity 
                    js-product-quantity-${matchingProduct.id}">
                      <span>
                        Quantity: <span class="quantity-label  js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
                      </span>
                      <span class="update-quantity-link link-primary js-update-quantity-link"
                      data-product-id="${matchingProduct.id}">
                        Update
                      </span>
                      <input type="Number" class ="quantity-input js-quantity-input-${matchingProduct.id}">
                      <span class="save-quantity-link link-primary js-save-quantity-link" 
                      data-product-id="${matchingProduct.id}">Save</span>

                      <span class="delete-quantity-link link-primary js-delete-quantity-link js-delete-link-${matchingProduct.id}"
                      data-product-id="${matchingProduct.id}">
                        Delete
                      </span>
                    </div>
                  </div>

                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct,cartItem)}
                  </div>
                </div>
              </div>
    `
    });

    function deliveryOptionsHTML(matchingProduct,cartItem){
      let  html = '' ;
      deliveryOptions.forEach((deliveryOption)=>{
         
        const dateString = calculateDeliveryDate(deliveryOption);

          const priceString = deliveryOption.deliveryPrice === 0 ? 'FREE' : `$${PriceFixer(deliveryOption.deliveryPrice)} -`  ;

          const isChecked = deliveryOption.id === cartItem.deliveryOptionId ;

       html +=

        `
        <div class="delivery-option js-delivery-option"
        data-product-id="${matchingProduct.id}"
        data-delivery-option-id="${deliveryOption.id}">
              <input type="radio"
              ${isChecked ? 'checked': ''}
                class="delivery-option-input"
                name="delivery-option-1-${matchingProduct.id}">
              <div>
                <div class="delivery-option-date">
                ${dateString}
                </div>
                <div class="delivery-option-price">
                ${priceString} Shipping
                </div>
              </div>
            </div>
        `
      });

      return html ;
    };

    document.querySelector('.js-order-summary').innerHTML = orderSummaryHTML ;


    document.querySelectorAll('.js-delete-quantity-link')
    .forEach((links)=>{
    links.addEventListener('click',()=>{
      const productId = links.dataset.productId ;
      removeFromCart(productId);
      saveToStorage();
      renderOrderSummary();
      renderPaymentSummary();
      });
    });



     function updateCartQuantity(){
        const cartQuantity = calculateCartQuantity() ; 
        document.querySelector('.return-to-home-link').innerText = `${cartQuantity} items` ;
    }

    updateCartQuantity();


    document.querySelectorAll('.js-update-quantity-link')
      .forEach((links)=>{
        links.addEventListener('click',()=>{

          const productId = links.dataset.productId;
          

        document.querySelector(`.js-cart-item-container-${productId}`)
        .classList.add('is-editing-quantity');
          
        });
    });

      document.querySelectorAll('.js-save-quantity-link')
      .forEach((links)=>{

          const productId = links.dataset.productId;
          const input = document.querySelector(`.js-quantity-input-${productId}`);


        links.addEventListener('click',()=>{
          handleUpdateQuantity(productId,input);
           renderPaymentSummary();
        });

        input.addEventListener('keydown',(event)=>{
          if(event.key === 'Enter'){
            handleUpdateQuantity(productId,input);
             renderPaymentSummary();
          };
        });

       

    });


    function handleUpdateQuantity(productId,input){
      const newQuantity = Number(input.value)
        if(newQuantity <= 0  || newQuantity >1000 || isNaN(newQuantity) ) {
          alert('invalid input')
          return ;
        }
          
          updateQuantity(productId,newQuantity);

          document.querySelector(`.js-quantity-label-${productId}`)
          .innerHTML = newQuantity ;

          updateCartQuantity();

          document.querySelector(`.js-cart-item-container-${productId}`)
        .classList.remove('is-editing-quantity');
    };



    document.querySelectorAll('.js-delivery-option')
    .forEach((element)=>{
      element.addEventListener('click',()=>{

      const {productId,deliveryOptionId} = element.dataset ;
      updateDeliveryOption(productId,deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();

    })
    });

};