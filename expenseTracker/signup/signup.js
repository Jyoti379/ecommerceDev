function userDetails(event)  {
    event.preventDefault();
    const name = event.target.username.value;
    const email = event.target.emailId.value;
    const phonenumber = event.target.phonenumber.value;
    const password =event.target.password.value
  
    const obj = {
        name,
        email,
        phonenumber,
        password,
    } 
    axios.post("http://localhost:3000/user/signup",obj)
    .then((response)=>{
      console.log(response);
      alert("your account created:Log in")
      window.location.href="../login/login.html"
    })

       .catch(err=>console.log(err));
    
 }
   


