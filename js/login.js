const form = document.getElementById("login_form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const login = async () => {
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      const data = { email: email.value, password: password.value };


        email.value.length === 0 ||  password.value.length ===0 ?   
        document.getElementById("errors").innerHTML = "email are required and password !!" : "";
    
     

      const response = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json"/*,'x-access-token':localStorage.getItem("token")*/ },
      });
      const json = await response.json();
      console.log(json._id)

    const data_object ={token:json.token , id:json._id}
      if (json.token) {
        alert(`Welcome ${json.first_name} ${json.last_name}`);
        localStorage.setItem("userdata", JSON.stringify(data_object));

        console.log(json.token)
       location.href = "index.html";
      } else {

        alert("check password and email")
        
      }
    };

    login();
  } catch (error) {
    console.log(error);
  }
});