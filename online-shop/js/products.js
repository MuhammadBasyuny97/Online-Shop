
 function counters(){
  document.getElementById('counters').innerHTML = 
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

const getHtmlList = (products,featuredProducts) => {
    let list = '';
  for (let i = 0; i < products.length; ++i) {
    let product = products[i];
   let {name} = product;
    let product_obj = new Product(product)

    featuredProducts.push(product_obj);
    if(i < 8){
        list += product_obj.getHtmlProduct(name);
        //console.log(product_obj.getName());
      }
  }
  return list;
}
const fetchFeaturedProducts = async () => {
  let response = await fetch("http://localhost:5000/api/products/getFeatured");
  response = await response.json();
  let products = response.data;
  let featured_products = [];
  let list = getHtmlList(products,featured_products);
  
  localStorage.setItem( "featuredProducts", JSON.stringify(featured_products) );
  document.getElementById('featured-products').innerHTML = list;
  //console.log(featured_products);
};

const fetchRecentProducts = async () => {
    let response = await fetch("http://localhost:5000/api/products/getRecent");
    response = await response.json();
    let products = response.data;
    let recentProducts = [];
    let list = getHtmlList(products,recentProducts);
    
    localStorage.setItem( "recentProducts", JSON.stringify(recentProducts) );
    document.getElementById('recent-products').innerHTML = list;
   // console.log("RecentProducts: ",recentProducts);
  };

 const addToWishList =() => {
    let counter = localStorage.getItem('loveCounter') ;
    if(counter === null) {
        counter = 0;
    }
    ++counter;

    localStorage.setItem('loveCounter',JSON.stringify(counter));
    document.getElementById('love-counter').innerHTML = localStorage.getItem('loveCounter');
}

const findProductAddedToCart = (name) =>{
      // debugger;
       let recentProducts =JSON.parse(localStorage.getItem('recentProducts'));
       let featuredProducts = JSON.parse(localStorage.getItem('featuredProducts'));
       console.log('recentProducts',recentProducts);
       console.log('featuredProducts',featuredProducts);
       let product;

       if(recentProducts.find(product => product._name === name)){
         product = recentProducts.filter(product => product._name === name);
         console.log("Product",product);
         return product[0];
         
       }
       else if(featuredProducts.find(product => product._name === name)){
        product = featuredProducts.filter(product => product._name === name);
        return product[0];
       }

}

const makeFinalCartProduct = (product, cartProducts) => {
    //debugger;
    let cartProduct = {};
    if(cartProducts.find(p => p.product._name === product._name)){
        let index = 0;
        for(let i = 0; i < cartProducts.length; ++i){
            if(product._name === cartProducts[i].product._name)index = i;
        }
        let {quantity, price, totalPrice} = cartProducts[index];
        quantity++;
        cartProducts[index].quantity = quantity ;
        cartProducts[index].totalPrice = price * quantity;
    }
    else {
         let price = product._price - (product._discount * product._price);
         quantity = 1;
         cartProduct  = { 
            product,
            price,
            quantity,
            totalPrice: quantity*price
         }
        cartProducts.push(cartProduct);
    }
    localStorage.setItem('cartProducts',JSON.stringify(cartProducts));
    return cartProduct;
}

const addToCart = (Name) =>{
    let counter = localStorage.getItem('cartCounter') ;
    if(counter === null) {
        counter = 0;
    }
    ++counter;

    localStorage.setItem('cartCounter',JSON.stringify(counter));
    document.getElementById('cart-counter').innerHTML = localStorage.getItem('cartCounter'); 
    let name = Name;
    let product = findProductAddedToCart(name);
    
    let cartProducts = (JSON.parse(localStorage.getItem('cartProducts')) ?? []);
    if(cartProducts.length === 0){
        localStorage.setItem('cartProducts',JSON.stringify(cartProducts));
    }
    
    let cartProduct = makeFinalCartProduct(product, cartProducts);

}
fetchFeaturedProducts();
fetchRecentProducts();


class Product {
  _id;
  _category_id;
  _name;
  _price;
  _color;
  _description;
  _discount;
  _image;
  _is_featured;
  _is_recent;
  _rating;
  _rating_count;
  _size;
  obj;
  cartAdded = false;

  constructor( obj ) {
    this._id = obj.id;
    this._category_id = obj.category_id;
    this._name = obj.name;
    this._price = obj.price;
    this._color = obj.color;
    this._description = obj.description;
    this._discount = obj.discount;
    this._image = obj.image;
    this._is_featured = obj.is_featured;
    this._is_recent = obj.is_recent;
    this._rating = obj.rating;
    this._rating_count = obj.rating_count;
    this._size = obj.size;
    this.obj = obj;
    
  }

  getPriceAfterDiscount(){
    let finalPrice = this._price - this._price * this._discount;
    return finalPrice;
  }
  getHtmlRating(){
    let halfStar = `<small class="fa fa-star-half-alt text-primary mr-1"></small>`;
    let Star  = `<small class="fa fa-star text-primary mr-1"></small>`;
    let list = '';
    let rating = this._rating;
    let i = 1
    for (; i  <= rating; ++i){
        list += Star;     
    }
    if(i - rating === .5)list += halfStar;
    return list;
  }
  getHtmlProduct(name){
    return `
    <div class="col-lg-3 col-md-4 col-sm-6 pb-1" " >
          <div class="product-item bg-light mb-4">
            <div class="product-img position-relative overflow-hidden">
              <img class="img-fluid w-100" src="${this._image}" alt="" />
              <div class="product-action">
                <a 
                  class="btn btn-outline-dark btn-square"
                  href="#"
                  value = ${this.obj}
                  onclick='addToCart(${JSON.stringify(name)})'
                  ><i class="fa fa-shopping-cart" ></i> 
                </a>
                <a  onclick='addToWishList()' class="btn btn-outline-dark btn-square" href="#"
                  ><i class="far fa-heart"></i
                ></a>
                <a class="btn btn-outline-dark btn-square" href="#"
                  ><i class="fa fa-sync-alt"></i
                ></a>
                <a class="btn btn-outline-dark btn-square" href="#"
                  ><i class="fa fa-search"></i
                ></a>
              </div>
            </div>
            <div class="text-center py-4">
              <a class="h6 text-decoration-none text-truncate" href=""
                >${this._name} </a
              >
              <div
                class="d-flex align-items-center justify-content-center mt-2"
              >
                <h5>$${this.getPriceAfterDiscount().toFixed(2)}</h5>
                <h6 class="text-muted ml-2"><del>$${this._price.toFixed(2)}</del></h6>
              </div>
              <div class="d-flex align-items-center justify-content-center mb-1" >
                ${this.getHtmlRating()}
              </div>
            </div>
          </div>
        </div>
    `
  }

 

  getId() {
    return this._id;
  }
  getCategoryId() {
    return this._category_id;
  }
  getName() {
    return this._name;
  }
  getColor() {
    return this._color;
  }
  getDescription() {
    return this._description;
  }
  getDiscount() {
    return this._discount;
  }
  getImage() {
    return this._image;
  }
  getIsFeatured() {
    return this._is_featured;
  }
  getIsRecent() {
    return this._is_recent;
  }
  getPrice() {
    return this._price;
  }
  getRating() {
    return this._rating;
  }
  getRatingCount() {
    return this._rating_count;
  }
  getSize() {
    return this._size;
  }
}



