async  function userLogin(event)  {
    try{
        event.preventDefault();
        const email = event.target.email.value;
       
        const password =event.target.password.value
      
        const obj = {
            email,
             password,
        }
    await axios.post("http://localhost:3000/user/login",obj).then(response=>{
        console.log(response)
        
        alert(response.data.message) 
       localStorage.setItem('token',response.data.token)
      window.location.href="../expense/addExpense.html"
       
        

        })
       
 
    
     }catch(err){
        console.log(err)
        console.log(err.response.data.message)
        const parentNode = document.getElementById('login');
         const childHTML=`<li style='color:red;'>${err.response.data.message}</li>`
         parentNode.innerHTML = parentNode.innerHTML + childHTML;

       
    }
       
        }