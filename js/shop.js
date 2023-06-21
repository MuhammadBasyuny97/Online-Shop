let myProducts = [];
fetch('http://localhost:5000/api/products/')
    .then(response => response.json())
    .then(data => {
        localStorage.setItem('products', JSON.stringify(data.data));
        
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
  const productList = document.getElementById('products-container');
        
    myProducts = JSON.parse(localStorage.getItem("products"));
    let filteredProducts = myProducts;
   

    const renderHTML = () => {
        
        document.getElementById("products-container").innerHTML = "";
        filteredProducts.forEach((p) => {
            document.getElementById("products-container").innerHTML += addNewProducts(p);
        })
       
    }

    const addNewProducts = (p) => {
        return `
        <div class="col-lg-4 col-md-6 col-sm-6 pb-1">
                    <div class="product-item bg-light mb-4">
                        <div class="product-img position-relative overflow-hidden">
                            <img class="img-fluid w-100" src="${p.image}" alt="${p.name}">
                            <div class="product-action">
                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
                                <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
                                <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
                            </div>
                        </div>
                        <div class="text-center py-4">
                            <a class="h6 text-decoration-none text-truncate" href="">${p.name}</a>
                            <div class="d-flex align-items-center justify-content-center mt-2">
                                <h5>$${p.price - (p.price * p.discount)}</h5><h6 class="text-muted ml-2"><del>$${p.price}</del></h6>
                            </div>
                            <div class="d-flex align-items-center justify-content-center mb-1">
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small class="fa fa-star text-primary mr-1"></small>
                                <small>(${p.rating})</small>
                            </div>
                        </div>
                    </div>
                </div>
        `
    }
        // forloop
        // if con product.price> 100 <200 =>> var msnjs
function calculatePriceAfterDiscount(price, discount) {
    const discountedPrice = price - (price * discount);
    return discountedPrice;
}
function onlyOne(checkbox) {
    var checkboxes = document.getElementsByName('price-checkbox');
    
    checkboxes.forEach((item) => {
        if (item !== checkbox) 
        item.checked = false;
    })
    
    if(checkbox.value  == "default") {
        filteredProducts = myProducts;
        renderHTML();
    }
    else {
         if (checkbox.name == "price-checkbox"){
            minPrice = checkbox.value - 100;
            maxPrice = checkbox.value ;
            filterProductsByPrice(minPrice, maxPrice);
            console.log(typeof checkbox.value);
         }
            
         
       
    }
}
function onlyTwo(checkbox) {
    var checkboxes = document.getElementsByName('color-checkbox');
    
    checkboxes.forEach((item) => {
        if (item !== checkbox) 
        item.checked = false;
    })
    
    if(checkbox.value  == "default") {
        filteredProducts = myProducts;
        renderHTML();
    }
    
            
else (checkbox.name == "color-checkbox")
{
    let colorcheck = checkbox.value;
    filterByColor(colorcheck);
    ;
}

    }

function onlyThree(checkbox) {
    var checkboxes = document.getElementsByName('size-checkbox');
    
    checkboxes.forEach((item) => {
        if (item !== checkbox) 
        item.checked = false;
    })
    
    if(checkbox.value  == "default") {
        filteredProducts = myProducts;
        renderHTML();
    }
    
            
else (checkbox.name == "size-checkbox")
{
    let sizecheck = checkbox.value;
    filterBySize(sizecheck);
    ;
}

    }
    

function filterProductsByPrice(minPrice, maxPrice) {
    filteredProducts = myProducts.filter(product => product.price >= minPrice && product.price <= maxPrice);
    renderHTML();
}
function filterByColor (colorcheck){
filteredProducts = myProducts.filter(product => product.color === colorcheck.toLowerCase());
console.log(filteredProducts);
renderHTML();
}
function filterBySize (sizecheck){
    filteredProducts = myProducts.filter(product => product.size === sizecheck.toLowerCase());
    console.log(filteredProducts);
    renderHTML();
    }
    function sortProductsByPrice() {
        filteredProducts.sort((a, b) => b.price - a.price);
        renderHTML();
    }
    
    function sortProductsByPopularity() {
        filteredProducts.sort((a, b) => b.popularity - a.popularity);
        renderHTML();
    }
    
    function sortProductsByRating() {
        filteredProducts.sort((a, b) => b.rating - a.rating);
        renderHTML();
    }
   
    function counters(){
        document.getElementById('counters-shop').innerHTML = 
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
renderHTML();