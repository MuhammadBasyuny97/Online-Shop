
////////////////Counters////////////////////////
function counters(){
    document.getElementById('cart-counters').innerHTML = 
    `
    <a href="" class="btn px-0">
    <i class="fas fa-heart text-primary"></i>
    <span 
      class="badge text-secondary border border-secondary rounded-circle"
      style="padding-bottom: 2px" id="love-counter"
      >${localStorage.getItem('loveCounter') ?? 0}</span
    >
  </a>
  <a href="./cart.html" class="btn px-0 ml-3" >
    <i class="fas fa-shopping-cart text-primary"></i>
    <span
      class="badge text-secondary border border-secondary rounded-circle"
      style="padding-bottom: 2px" id="cart-counter"
      >${localStorage.getItem('cartCounter') ?? 0}</span
    >
  </a>`
  };
  
  counters();
///////////////////////////////////////////////////////////////////
const getCartProducts = () => {
    let cartProducts = JSON.parse(localStorage.getItem('cartProducts'));
    return cartProducts;
};


//Decrement The Product Quantity
const decrement = (name) =>{
   
    let cartProducts = getCartProducts();
   
    let index = 0;
    for(let i =0; i < cartProducts.length; ++i){
        if(cartProducts[i].product._name === name){
            index = i;
            let quantity =  cartProducts[i].quantity - 1;
            cartProducts[i].quantity = quantity;
            break;
        } 
    }
   
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts));

    new Cart(cartProducts);
}

//Increment the Quantity of the Product
const increment = (name) =>{
    let cartProducts = getCartProducts();
    console.log("Before Decrement", cartProducts);
    let index = 0;
    for(let i =0; i < cartProducts.length; ++i){
        if(cartProducts[i].product._name === name){
            index = i;
            let quantity =  cartProducts[i].quantity + 1;
            cartProducts[i].quantity = quantity;
            break;
        } 
    }
 
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts));

    new Cart(cartProducts);
}

//Remove Product from the Cart
const remove = (name) =>{
    let cartProducts = getCartProducts();
    console.log("Before remove", cartProducts);
    let index = 0;
    for(let i =0; i < cartProducts.length; ++i){
        if(cartProducts[i].product._name === name){
            index = i;
            break;
        } 
    }
    cartProducts.splice(index,1);
 
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts));

    new Cart(cartProducts);
}



//////////////Class CartLine /////////////////////////
class CartLine{
    product;
    quantity;
    totalPrice;
    constructor(product,quantity,totalPrice){
        this.product = product;
        this.quantity = quantity;
        this.totalPrice = totalPrice;
    }
    getQuantityInput(){
        return  `
        <div
        class="input-group quantity mx-auto"
        style="width: 100px"
         >
        <div class="input-group-btn">
          <button onclick='decrement(${JSON.stringify(this.product._name)})'
            type="button"
            class="decBtn btn btn-sm btn-primary btn-minus"
          >
            <i class="fa fa-minus"></i>
          </button>
        </div>
        <input
          type="text"
          class="quantityVal form-control form-control-sm bg-secondary border-0 text-center" id="quantityInput"
          value= ${this.quantity}
        />
        <div class="input-group-btn">
          <button onclick='increment(${JSON.stringify(this.product._name)})'
            type="button"
            class="incBtn btn btn-sm btn-primary btn-plus"
          >
            <i class="fa fa-plus"></i>
          </button>
        </div>
      </div>
        
        
        `
        
      
    }
    getCartLineHtml(){
        return `  
         <tr>
        <td class="align-middle">
          <img src="${this.product._image}" alt="" style="width: 50px" />
          ${this.product._name}
        </td>
        <td class="align-middle">$${this.getPriceAfterDiscount()}</td>
        <td class="align-middle">
        ${this.getQuantityInput()}
        </td>
        <td class="align-middle">$${this.getTotalPrice()}</td>
        <td class="align-middle">
          <button class="btn btn-sm btn-danger" type="button" onclick='remove(${JSON.stringify(this.product._name)})'>
            <i class="fa fa-times"></i>
          </button>
        </td>
      </tr>`
    }
    getTotalPrice(){
        this.totalPrice =  (this.product._price - this.product._discount * this.product._price ) * this.quantity;
        return this.totalPrice;
        
      
    }
    getPriceAfterDiscount(){
        return (this.product._price - this.product._discount * this.product._price )
    }
    increment(){
    
    
        return this.quantity++;
        
        
    }
    decrement(name){
        if(this.quantity > 1) this.quantity--;
    }

    

}
///////////// Class Cart //////////////////////
class Cart{

  cartLines;
 
  constructor(productsArr){
    this.cartLines = [];

    for(let i = 0; i < productsArr.length; ++i){
        let {product,quantity,totalPrice} = productsArr[i];
        let cartLine = new CartLine (product,quantity,totalPrice);
        this.cartLines.push(cartLine); 
        this.getCartHtml();  
        this.getSubTotal();   
        this.getTotalQunatity();
    }
  }

  getCartHtml(){
    let list = '';
    this.cartLines.forEach(element => {
        list += element.getCartLineHtml();  
    } )
    document.getElementById('products').innerHTML = list;
  }


  getSubTotal(){
    let subTotal = 0 ;
    this.cartLines.forEach(element => {
        subTotal += element.totalPrice;
    })
    document.getElementById('sub-total').innerHTML = `$${subTotal}`
  }
  getTotalQunatity(){
    let total = 0;
    this.cartLines.forEach(element => {
        total += element.quantity;
    })
    localStorage.setItem('cartCounter',JSON.stringify(total));
    counters();
    return total;
}
}
let productsArr = JSON.parse(localStorage.getItem('cartProducts'));
let cartLine = new Cart (productsArr);

const checkout = ()=> {
  window.location.href = "checkout.html";
}