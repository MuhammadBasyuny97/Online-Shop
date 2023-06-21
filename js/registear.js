const form = document.getElementById("Reagister_form");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  try {
    const signup = async () => {
      const first_name = document.getElementById("firstname");
      const last_name = document.getElementById("lastname");
      const email = document.getElementById("email");
      const password = document.getElementById("password");
      
      const data = { email: email.value, password: password.value , first_name:first_name.value, last_name:last_name.value};


        email.value.length === 0 || password.value.length ===0 || first_name.value.length === 0 || last_name .value.length === 0 ?   
        document.getElementById("errors").innerHTML = "all fields are required !!" : "";


      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json"/*,'x-access-token':localStorage.getItem("token")*/ },
      });
      const json = await response.json();
       console.log(json)
      if (json.token) {
        alert(`Welcome ${json.first_name} ${json.last_name}`);
        localStorage.setItem("token", json.token);
        location.href = "index.html";
      } else {

        alert(" User Already Exist. Please Login")
        
      }
     
    };

    signup();
  } catch (error) {
    console.log(error);
  }
});