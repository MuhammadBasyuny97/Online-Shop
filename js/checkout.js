// dumby values till project is assembled
// let user = { id: 500, name: "mina", token: 123456 };
// localStorage.setItem("user", JSON.stringify(user));
//  let products = [
//    { name: "prod1", price: 100, quantity: 2 },
//    { name: "prod2", price: 200, quantity: 1 },
//    { name: "prod3", price: 300, quantity: 5 },
//  ];
//  localStorage.setItem("orderedProducts", JSON.stringify(products));

//checking if user is signed in first or not
const isSigned = function () {
  if (localStorage.getItem("userdata")) return true;
  return false;
};

if (!isSigned()) {
  alert("Please Log in first!");
  window.location.href = "login.html";
}

let orderedProducts = JSON.parse(localStorage.getItem("cartProducts"));

const renderHTML = () => {
  orderedProducts.forEach((p) => {
    document.getElementById("products-container").innerHTML += addNewProduct(p);
  });
};

const addNewProduct = (p) => {
  return `
    <div id="orderedProducts" class="d-flex justify-content-between">
    <p>${p.product._name} x (${p.quantity})</p>
    <p>$${p.price * p.quantity}</p>
    </div>
    `;
};

const calcSubTotal = function () {
  let sum = 0;
  for (let i = 0; i < orderedProducts.length; i++) {
    sum += parseInt(orderedProducts[i].price * orderedProducts[i].quantity);
  }
  document.getElementById("subTotal").innerText = `$${sum}`;
  return sum;
};

const paypal = function () {
  subTotal = calcSubTotal();
  let tax = subTotal * 0.1;
  document.getElementById("tax").innerHTML = `$${tax}`;
  return total(tax);
};

const directCheck = function () {
  subTotal = calcSubTotal();
  let tax = subTotal * 0.15;
  document.getElementById("tax").innerHTML = `$${tax}`;
  return total(tax);
};

const bankTransfer = function () {
  subTotal = calcSubTotal();
  let tax = subTotal * 0.05;
  document.getElementById("tax").innerHTML = `$${tax}`;
  return total(tax);
};

const total = function (tax) {
  tot = calcSubTotal() + tax;
  document.getElementById("total").innerHTML = `$${tot}`;
  return tot;
};

const getShippingInfo = function () {
  let firstName = document.getElementById("firstName").value;
  let lastName = document.getElementById("lastName").value;

  let mail = document.getElementById("mail").value;
  let phone = document.getElementById("phone").value;

  let address1 = document.getElementById("address1").value;
  let address2 = document.getElementById("address2").value;

  let country = document.getElementById("country").value;
  let city = document.getElementById("city").value;

  let state = document.getElementById("state").value;
  let zipCode = document.getElementById("zipCode").value;

  let shipping_info = {
    first_name: firstName,
    last_name: lastName,
    email: mail,
    mobile_number: phone,
    address1: address1,
    address2: address2,
    country: country,
    city: city,
    state: state,
    zip_code: zipCode,
  };

  return shipping_info;
};

const validation = () => {
  let shipping = getShippingInfo();
  let flag = 0;
  if (
    shipping.first_name &&
    shipping.last_name &&
    shipping.email &&
    shipping.mobile_number &&
    shipping.address1 &&
    shipping.city &&
    shipping.state &&
    shipping.zip_code
  ) {
    //alert("all is good");
    flag = 1;
  } else {
    alert("Please fill all the required fields");
  }

  if (flag == 1) {
    if (
      isNaN(shipping.first_name) &&
      isNaN(shipping.last_name) &&
      isNaN(shipping.city) &&
      isNaN(shipping.state) &&
      isNaN(shipping.address1) &&
      isNaN(shipping.email)
    ) {
      // alert("ALL IS GOOD");
      return true;
    } else {
      alert("Enter valid data");
    }
  }
};

const radioCheck = function () {
  if (
    document.getElementById("paypal").checked ||
    document.getElementById("directcheck").checked ||
    document.getElementById("banktransfer").checked
  )
    return true;
  else {
    alert("Please select your payment method.");
  }
};

const placeOrder = function () {
  let isValid = validation();
  if (isValid && radioCheck()) {
    if (!isSigned()) {
      alert("Please Log in first!");
      /*window.location.href = "login.html";*/
    }

    const API = "http://localhost:5000/api/orders/";
    let shipping = getShippingInfo();
    let subtotal = calcSubTotal();
    let items = 0; // number of products shipped
    for (let i = 0; i < orderedProducts.length; i++) items++;

    let totalPrice;
    if (document.getElementById("paypal").checked) {
      totalPrice = paypal();
    } else if (document.getElementById("directcheck").checked) {
      totalPrice = directCheck();
    } else if (document.getElementById("banktransfer").checked) {
      totalPrice = bankTransfer();
    }

    let user_data = JSON.parse(localStorage.getItem("userdata"));
    let user_id = user_data.id;
    let token = user_data.token;
    let requestBody = {
      sub_total_price: subtotal,
      shipping: 10,
      total_price: totalPrice,
      user_id: user_id,
      order_date: new Date(),
      order_details: orderedProducts,
      shipping_info: shipping,
    };

    fetch(API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": token,
      },
      body: JSON.stringify(requestBody),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .finally(() => {
        alert("your order has been placed successfully.");
        window.location.href = "index.html";
      })
      .catch((error) => {
        alert("An Error have occured.");
        console.log("Error:", error);
      });
  }
};

function counters(){
  document.getElementById('counters-checkout').innerHTML = 
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
calcSubTotal();
renderHTML();
